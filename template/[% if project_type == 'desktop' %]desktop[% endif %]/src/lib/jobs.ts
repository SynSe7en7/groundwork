// Modal seam. Heavy compute (GPU / long Python jobs) lives in Modal, off the
// hot path. The webview NEVER holds the Modal secret: it POSTs to the web tier
// (the same Next.js codebase deployed as a server, e.g. on Vercel) at
// /api/jobs, or to a Supabase Edge Function, and that server-side hop calls
// Modal over HTTPS and verifies the webhook secret. Here we only know the
// public base URL of that tier.
const JOBS_API_BASE = process.env.NEXT_PUBLIC_JOBS_API_BASE ?? "";

export interface JobRequest {
  kind: string;
  payload: Record<string, unknown>;
}

export interface JobAccepted {
  id: string;
  status: "queued" | "running" | "done" | "error";
}

export async function submitJob(req: JobRequest): Promise<JobAccepted> {
  if (!JOBS_API_BASE) {
    throw new Error("NEXT_PUBLIC_JOBS_API_BASE is not set.");
  }
  const res = await fetch(`${JOBS_API_BASE}/api/jobs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`jobs endpoint returned ${res.status}`);
  }
  return (await res.json()) as JobAccepted;
}
