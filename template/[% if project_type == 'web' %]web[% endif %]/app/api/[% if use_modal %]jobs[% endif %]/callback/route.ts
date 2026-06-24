import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Result callback from Modal. Verifies a shared token before writing the
 * outcome back to the jobs row. Modal authenticates with MODAL_CALLBACK_TOKEN;
 * this route never trusts an unsigned request.
 */
export async function POST(request: Request) {
  const expected = process.env.MODAL_CALLBACK_TOKEN;
  const provided = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { job_id, status, result } = await request.json().catch(() => ({}));

  if (!job_id) {
    return NextResponse.json({ error: "missing job_id" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("jobs")
    .update({ status: status ?? "done", result: result ?? null })
    .eq("id", job_id);

  if (error) {
    return NextResponse.json({ error: "could not update job" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
