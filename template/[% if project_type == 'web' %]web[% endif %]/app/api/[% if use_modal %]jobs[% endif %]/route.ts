import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitModalJob } from "@/lib/modal/client";

export const dynamic = "force-dynamic";

/**
 * Enqueue a heavy-compute job. Auth-checks the caller, records a jobs row
 * through Supabase (Row Level Security applies), then hands the work to Modal
 * over HTTPS. Modal posts results back to the callback route when finished.
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const { data: job, error } = await supabase
    .from("jobs")
    .insert({ user_id: user.id, status: "queued", payload: body })
    .select("id")
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "could not create job" }, { status: 500 });
  }

  try {
    await submitModalJob({ job_id: job.id, ...body });
  } catch {
    await supabase.from("jobs").update({ status: "failed" }).eq("id", job.id);
    return NextResponse.json({ error: "job dispatch failed" }, { status: 502 });
  }

  return NextResponse.json({ job_id: job.id, status: "queued" }, { status: 202 });
}
