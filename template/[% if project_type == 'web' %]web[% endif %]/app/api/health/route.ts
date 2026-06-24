import { NextResponse } from "next/server";
import pkg from "@/package.json";

export const dynamic = "force-dynamic";

/**
 * Lightweight health and version probe. Reads the deployment environment and
 * commit from the Vercel system environment variables, falling back to local
 * development values when run outside Vercel.
 */
export function GET() {
  return NextResponse.json({
    app_env: process.env.VERCEL_ENV ?? "development",
    version: pkg.version,
    git_sha: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
  });
}
