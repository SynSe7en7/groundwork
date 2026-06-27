#!/usr/bin/env bash
# create-groundwork: spin up a project from the groundwork foundation.
#
# Quickest start (no clone needed):
#   curl -LsSf https://raw.githubusercontent.com/SynSe7en7/groundwork/main/scripts/create-groundwork.sh | bash -s -- ./my-app
# From a clone:
#   bash scripts/create-groundwork.sh ./my-app
#
# It (1) preflights prerequisites, (2) generates the project with Copier (writing
# .copier-answers.yml so the project stays updatable), and (3) offers the first
# run (install deps + just verify). Any arguments after the destination are
# forwarded to `copier copy`, for example:
#   bash scripts/create-groundwork.sh ./my-app --data project_type=web --vcs-ref v0.8.0
#
# Env overrides:
#   GROUNDWORK_SRC   copier source (default gh:SynSe7en7/groundwork)
set -euo pipefail

SRC="${GROUNDWORK_SRC:-gh:SynSe7en7/groundwork}"
DEST="${1:-./my-groundwork-app}"
if [ "$#" -gt 0 ]; then shift; fi
EXTRA=("$@")

note() { printf '%s\n' "$*"; }
fail() { printf 'error: %s\n' "$*" >&2; exit 1; }

note "create-groundwork"
note "  source:      $SRC"
note "  destination: $DEST"

# 1) Preflight (the pre-generation doctor).
command -v uv  >/dev/null 2>&1 || fail "uv is required (it provides uvx). Install: curl -LsSf https://astral.sh/uv/install.sh | sh"
command -v git >/dev/null 2>&1 || fail "git is required."
if [ -e "$DEST" ] && [ -n "$(ls -A "$DEST" 2>/dev/null || true)" ]; then
  fail "destination '$DEST' already exists and is not empty."
fi

# 2) Generate. --trust is required because the template runs post-copy tasks
#    (git init, slug substitution). Extra args are forwarded to copier.
#    "${EXTRA[@]+...}" guards the empty-array expansion: under `set -u`, a bare
#    "${EXTRA[@]}" on an empty array is an unbound-variable error on bash < 4.4
#    (macOS ships bash 3.2), which is exactly the no-extra-args quickest-start.
note ""
note "Generating with Copier ..."
uvx copier copy --trust "${EXTRA[@]+"${EXTRA[@]}"}" "$SRC" "$DEST"

# 3) Report the assigned scaffold and offer the first run.
scaffold="$(grep -E '^project_type:' "$DEST/.copier-answers.yml" 2>/dev/null | awk '{print $2}' || true)"
note ""
note "Created '$DEST' (scaffold: ${scaffold:-unknown})."

first_run() {
  ( cd "$DEST"
    if ! command -v just >/dev/null 2>&1; then
      note "just is not installed, so skipping the first run."
      note "Install just (brew install just), then: cd $DEST && just setup && just verify"
      return 0
    fi
    note "Installing dependencies (just setup) ..."
    just setup
    note "Verifying (just verify) ..."
    just verify
  )
}

if [ -t 0 ]; then
  printf 'Install dependencies and run "just verify" now? [y/N] '
  read -r ans
  case "$ans" in
    y|Y|yes|YES) first_run ;;
    *) note "Skipped. Next: cd $DEST && just setup && just verify" ;;
  esac
else
  note "Next steps:"
  note "  cd $DEST"
  note "  just setup     # install dependencies"
  note "  just verify    # lint + typecheck + test"
  note "  just doctor    # prerequisites + foundation update status"
fi
