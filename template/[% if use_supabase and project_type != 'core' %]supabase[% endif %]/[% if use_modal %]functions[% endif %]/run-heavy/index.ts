// Supabase Edge Function: run-heavy
// The device or browser calls this; it validates the caller, rate-limits per
// user, caps the payload, enqueues a jobs row, and hands off to the Modal HTTPS
// endpoint with a timeout and a host allowlist. The Modal secret lives only here
// as a function secret, never in a client bundle. Modal writes results back to
// the jobs row with the service key.
import { createClient } from "jsr:@supabase/supabase-js@2";

const MAX_PAYLOAD_BYTES = 64 * 1024; // reject bodies larger than 64 KB
const RATE_LIMIT = 30; // jobs per user per window
const RATE_WINDOW_SECONDS = 60;
const MODAL_TIMEOUT_MS = 10_000; // abort the Modal handoff if it hangs
const MODAL_ALLOWED_HOSTS = (Deno.env.get("MODAL_ALLOWED_HOSTS") ?? ".modal.run")
  .split(",").map((s) => s.trim()).filter(Boolean);

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Defense in depth: the Modal endpoint is operator-configured, but require HTTPS
// and an allowlisted host so a misconfigured env cannot point this at an internal
// address (SSRF). Override the allowlist with MODAL_ALLOWED_HOSTS (comma-list).
function isAllowedModalUrl(url: string): boolean {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  return MODAL_ALLOWED_HOSTS.some((h) => {
    const host = h.replace(/^\./, "");
    return u.hostname === host || u.hostname.endsWith("." + host);
  });
}

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SECRET_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return json({ error: "unauthorized" }, 401);
  }

  // Payload-size cap: the declared length first, then the actual body.
  if (Number(req.headers.get("content-length") ?? "0") > MAX_PAYLOAD_BYTES) {
    return json({ error: "payload too large" }, 413);
  }
  const raw = await req.text();
  if (raw.length > MAX_PAYLOAD_BYTES) {
    return json({ error: "payload too large" }, 413);
  }
  let payload: unknown = {};
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      return json({ error: "invalid JSON body" }, 400);
    }
  }

  // Per-user rate limit: count this user's jobs in the recent window.
  const since = new Date(Date.now() - RATE_WINDOW_SECONDS * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);
  if (countError) {
    return json({ error: countError.message }, 500);
  }
  if ((count ?? 0) >= RATE_LIMIT) {
    return json({ error: "rate limit exceeded; retry later" }, 429);
  }

  const { data: job, error: insertError } = await supabase
    .from("jobs")
    .insert({ user_id: user.id, payload })
    .select("id")
    .single();
  if (insertError) {
    return json({ error: insertError.message }, 500);
  }

  // Hand off to Modal with an allowlist check and a timeout. A failed handoff
  // leaves the job queued for a retry sweep rather than hanging the request.
  const modalEndpoint = Deno.env.get("MODAL_ENDPOINT_URL");
  if (modalEndpoint) {
    if (!isAllowedModalUrl(modalEndpoint)) {
      return json({ error: "MODAL_ENDPOINT_URL is not an allowed https host" }, 500);
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), MODAL_TIMEOUT_MS);
    try {
      await fetch(modalEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Modal-Token": Deno.env.get("MODAL_TOKEN") ?? "",
        },
        body: JSON.stringify({ job_id: job.id, user_id: user.id, payload }),
        signal: controller.signal,
      });
    } catch (_) {
      // Timed out or failed; the queued job row remains for a retry sweep.
    } finally {
      clearTimeout(timer);
    }
  }

  return json({ job_id: job.id, status: "queued" }, 202);
});
