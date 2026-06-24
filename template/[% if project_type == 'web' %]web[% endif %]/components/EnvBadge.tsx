"use client";

import { useEffect, useState } from "react";

type Health = {
  app_env: string;
  version: string;
  git_sha: string;
};

const TONE: Record<string, string> = {
  production: "bg-emerald-100 text-emerald-900",
  preview: "bg-amber-100 text-amber-900",
  development: "bg-slate-100 text-slate-900",
};

/**
 * Small badge that reads /api/health and shows the active environment, app
 * version, and short commit. Useful for confirming which build is live.
 */
export function EnvBadge() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  if (!health) return null;

  const tone = TONE[health.app_env] ?? TONE.development;
  const sha = health.git_sha.slice(0, 7);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${tone}`}
      title={`version ${health.version} at ${sha}`}
    >
      {health.app_env} · v{health.version} · {sha}
    </span>
  );
}
