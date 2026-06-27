#!/usr/bin/env bash
# Regenerate the committed per-scaffold lockfiles in the template. Run this when a
# scaffold's dependencies change, then commit the result and regenerate the golden
# snapshots (scripts/snapshot.py update).
#
#   COPIER_CMD="/path/to/copier" PNPM_CMD="npx --yes pnpm@9" bash scripts/update_lockfiles.sh
#
# Lockfiles are committed STATIC (not .jinja):
#  - npm scaffolds: `npm ci` tolerates a root-name mismatch, so a fixed name is fine.
#  - hybrid: generated with project_slug=PROJECT_SLUG_PLACEHOLDER so the lockfile
#    keeps the placeholder scope; the copier slug-substitution task rewrites it to
#    the real slug at generation (verified: frozen install passes post-substitution).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COPIER=${COPIER_CMD:-copier}
PNPM=${PNPM_CMD:-"npx --yes pnpm@9"}
cd "$ROOT"

render() { # project_type out [extra-data...]
  local pt="$1" out="$2"; shift 2
  $COPIER copy --defaults --trust --skip-tasks --vcs-ref HEAD \
    --data project_type="$pt" --data project_name="Lockgen" "$@" . "$out" >/dev/null
}

npm_lock() { # project_type appdir destdir
  local pt="$1" appdir="$2" dest="$3"
  local tmp; tmp="$(mktemp -d)"
  render "$pt" "$tmp"
  ( cd "$tmp/$appdir" && npm install --no-audit --no-fund >/dev/null 2>&1 )
  cp "$tmp/$appdir/package-lock.json" "$dest/package-lock.json"
  echo "wrote $dest/package-lock.json"
}

echo "=== web ==="
npm_lock web web "$ROOT/template/[% if project_type == 'web' %]web[% endif %]"

echo "=== mobile ==="
npm_lock mobile mobile "$ROOT/template/[% if project_type == 'mobile' %]mobile[% endif %]"

echo "=== desktop (npm + cargo) ==="
DTMP="$(mktemp -d)"; render desktop "$DTMP"
( cd "$DTMP/desktop" && npm install --no-audit --no-fund >/dev/null 2>&1 )
cp "$DTMP/desktop/package-lock.json" "$ROOT/template/[% if project_type == 'desktop' %]desktop[% endif %]/package-lock.json"
echo "wrote desktop/package-lock.json"
( cd "$DTMP/desktop/src-tauri" && cargo generate-lockfile >/dev/null 2>&1 )
cp "$DTMP/desktop/src-tauri/Cargo.lock" "$ROOT/template/[% if project_type == 'desktop' %]desktop[% endif %]/src-tauri/Cargo.lock"
echo "wrote desktop/src-tauri/Cargo.lock"

echo "=== hybrid (pnpm, placeholder scope) ==="
HTMP="$(mktemp -d)"
render hybrid "$HTMP" --data project_slug=PROJECT_SLUG_PLACEHOLDER
( cd "$HTMP" && $PNPM install --no-frozen-lockfile >/dev/null 2>&1 )
cp "$HTMP/pnpm-lock.yaml" "$ROOT/template/[% if project_type == 'hybrid' %]pnpm-lock.yaml[% endif %]"
echo "wrote hybrid pnpm-lock.yaml"

echo "DONE. Now: scripts/snapshot.py update, switch CI installs to frozen, commit."
