// Supabase Edge Function: run-heavy
// The device or browser calls this; it validates the caller, enqueues a jobs
// row, and hands off to the Modal HTTPS endpoint. The Modal secret lives only
// here as a function secret, never in a client bundle. Modal writes results
// back to the jobs row with the service key.
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SECRET_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const payload = await req.json().catch(() => ({}));
  const { data: job, error: insertError } = await supabase
    .from("jobs")
    .insert({ user_id: user.id, payload })
    .select("id")
    .single();
  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
  }

  // Hand off to Modal (heavy compute, off the hot path). Modal writes results
  // back to the jobs row with the service key and the shared token.
  const modalEndpoint = Deno.env.get("MODAL_ENDPOINT_URL");
  if (modalEndpoint) {
    await fetch(modalEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Modal-Token": Deno.env.get("MODAL_TOKEN") ?? "",
      },
      body: JSON.stringify({ job_id: job.id, user_id: user.id, payload }),
    });
  }

  return new Response(JSON.stringify({ job_id: job.id, status: "queued" }), {
    status: 202,
    headers: { "Content-Type": "application/json" },
  });
});
