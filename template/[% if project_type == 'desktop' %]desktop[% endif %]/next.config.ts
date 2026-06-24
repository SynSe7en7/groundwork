import type { NextConfig } from "next";

// Tauri packages a STATIC site into the system webview: there is no Node server
// at runtime, so SSR, middleware, and route handlers are unavailable here.
// `output: 'export'` emits a plain ./out directory that tauri.conf.json points
// frontendDist at. All data flows through the Supabase browser client and
// HTTPS calls from the webview.
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  // Tauri serves files over the tauri:// (or asset) protocol, which has no host
  // rewriting, so emit directory-style routes with trailing-slash index.html.
  trailingSlash: true,
  // The webview loads files locally; Next's image optimizer needs a server.
  images: { unoptimized: true },
  // Tauri dev serves the export on a fixed dev URL; keep asset paths relative.
  assetPrefix: isProd ? undefined : undefined,
  // Surface lint and type errors at build time rather than masking them.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
