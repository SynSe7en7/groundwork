"use client";

import { useState } from "react";
import EnvBadge from "@/components/EnvBadge";
import { supabase } from "@/lib/supabase";
import { submitJob } from "@/lib/jobs";

// One landing screen. It demonstrates three seams without building a feature:
//  1. Supabase browser client (auth/session check),
//  2. the deep-link OAuth path (sign-in opens the system browser),
//  3. the Modal seam (POST to the web tier, which fronts Modal).
export default function Home() {
  const [status, setStatus] = useState<string>("idle");

  async function checkSession() {
    if (!supabase) {
      setStatus("Supabase is not configured (set NEXT_PUBLIC_SUPABASE_*).");
      return;
    }
    const { data } = await supabase.auth.getSession();
    setStatus(data.session ? "signed in" : "no session");
  }

  async function runJob() {
    setStatus("submitting job...");
    try {
      const res = await submitJob({ kind: "example", payload: { hello: "world" } });
      setStatus(`job accepted: ${res.id}`);
    } catch (err) {
      setStatus(`job failed: ${(err as Error).message}`);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "2rem",
      }}
    >
      <EnvBadge />
      <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 650 }}>
        Desktop shell is running
      </h1>
      <p style={{ margin: 0, opacity: 0.7, maxWidth: 460, textAlign: "center" }}>
        Next.js static export inside the Tauri 2 system webview. Replace this
        screen with your app. The buttons below exercise the wired seams.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={checkSession} style={buttonStyle}>
          Check Supabase session
        </button>
        <button onClick={runJob} style={buttonStyle}>
          Submit example job (Modal seam)
        </button>
      </div>

      <code style={{ opacity: 0.85, fontSize: "0.9rem" }}>status: {status}</code>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  background: "#1f6feb",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "0.6rem 1rem",
  fontSize: "0.95rem",
  cursor: "pointer",
};
