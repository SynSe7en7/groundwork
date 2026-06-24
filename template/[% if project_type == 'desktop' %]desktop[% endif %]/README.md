# Desktop preset (Tauri 2 + Next.js static export)

A Tauri 2 desktop app that packages a Next.js static export (`output: 'export'`)
into the system webview. Supabase runs through the browser client; OAuth
completes via a registered deep link; heavy compute is delegated to a web tier
that fronts Modal.

## Layout

- `src/` — Next.js App Router frontend (the webview UI). Static-exported to `out/`.
- `src-tauri/` — the Rust shell: window, plugins, bundling, updater config.
- `.github/workflows/release.yml` — tagged-release pipeline (build, sign, publish).

## Develop

```sh
npm install
npm run tauri:dev      # launches the Rust shell + Next dev server
# web layer only (no Rust toolchain needed):
npm run dev            # Next dev server at http://localhost:3000
npm run build:web      # static export into ./out
```

The Tauri shell needs the Rust toolchain (min Rust 1.77.2) and the OS webview:
WebView2 (Windows), WebKitGTK (Linux), system WebKit (macOS). A headless CI
container without those native deps can build the web layer but not the shell.

## Environment

Client-safe values only reach the webview. Set in `.env.local` (gitignored):

- `NEXT_PUBLIC_APP_ENV` — `develop` or `prod`; drives the env badge.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — the
  publishable key is client-safe. The secret key (`sb_secret_*`) bypasses RLS
  and must never ship in the bundle.
- `NEXT_PUBLIC_DEEP_LINK_SCHEME` — OAuth callback scheme; matches the
  `deep-link` scheme in `src-tauri/tauri.conf.json` (the project slug).
- `NEXT_PUBLIC_JOBS_API_BASE` — the web tier the webview POSTs jobs to. That
  tier holds the Modal secret; this app never does.

## Signing and self-update

The updater requires a signature keypair. Generate it once:

```sh
npm run tauri signer generate -- -w ~/.tauri/app.key
```

Then:

1. Put the printed public key into `plugins.updater.pubkey` in
   `src-tauri/tauri.conf.json`.
2. Set the `OWNER` in `plugins.updater.endpoints` to your GitHub org/user.
3. Add CI secrets `TAURI_SIGNING_PRIVATE_KEY` and
   `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.

Push a `v*` tag to run the release workflow. It builds macOS (arm64 + x64),
Linux, and Windows, signs the bundles and updater artifacts, and attaches
`latest.json` to the GitHub Release the updater reads.

### macOS notarization

For distributable macOS builds, add the Apple secrets referenced in
`.github/workflows/release.yml` (`APPLE_CERTIFICATE`,
`APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`,
`APPLE_PASSWORD`, `APPLE_TEAM_ID`). tauri-action notarizes the app when they
are present.

## Optional local SQLite

`tauri-plugin-sql` is wired but commented out in three places: `Cargo.toml`,
`src-tauri/src/lib.rs`, and `src-tauri/capabilities/default.json`. Uncomment all
three to enable an on-device store.

## App icons

`src-tauri/icons/` is not committed in this skeleton. Generate the set from a
1024x1024 PNG once with `npm run tauri icon path/to/icon.png`.
