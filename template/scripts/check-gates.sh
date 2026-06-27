#!/usr/bin/env bash
# Enforce alignment gates on a pull request. Maps the changed files to the gates
# they trigger, and fails if a triggered gate is not ratified in docs/GATES.md,
# unless the gate's artifact is being ratified in this same PR, or the PR body
# carries an exemption.
#
# Inputs (env):
#   BASE_REF   the PR base branch (default: main)
#   PR_BODY    the PR description (for exemptions)
#   GATES_FILE override docs/GATES.md path (for tests; default docs/GATES.md)
# Exemption syntax, anywhere in the PR body:
#   gate-exempt: <key>[, <key>...]   keys: stack, design, deploy
#
# Run by .github/workflows/ci.yml on pull_request.
set -uo pipefail

gates="${GATES_FILE:-docs/GATES.md}"
body="${PR_BODY:-}"
# Determine the changed-file range. Prefer the PR base SHA (reachable with
# actions/checkout fetch-depth: 0); else fetch the base branch; else the last commit.
if [ -n "${BASE_SHA:-}" ] && git rev-parse -q --verify "${BASE_SHA}^{commit}" >/dev/null 2>&1; then
  range="${BASE_SHA}...HEAD"
else
  git fetch --no-tags --depth=100 origin "+refs/heads/${BASE_REF:-main}:refs/remotes/origin/${BASE_REF:-main}" >/dev/null 2>&1 || true
  if git rev-parse -q --verify "origin/${BASE_REF:-main}" >/dev/null 2>&1; then
    range="origin/${BASE_REF:-main}...HEAD"
  else
    range="HEAD~1...HEAD"
  fi
fi
changed=$(git diff --name-only "$range" 2>/dev/null || true)
added=$(git diff --name-only --diff-filter=A "$range" 2>/dev/null || true)
fail=0

gate_status() { # row-prefix -> lowercased status from the docs/GATES.md State table
  grep -iE "^\| *$1" "$gates" 2>/dev/null | head -1 \
    | awk -F'|' '{gsub(/^[[:space:]]+|[[:space:]]+$/,"",$3); print tolower($3)}'
}
ratified() { case "$(gate_status "$1")" in ratified|superseded) return 0 ;; *) return 1 ;; esac; }
exempt()   { printf '%s' "$body" | grep -qiE "gate-exempt:.*(^|[ ,])$1([ ,]|\$)"; }

check() { # display-name key gates-row trigger(0/1) artifact-in-pr(0/1)
  local name="$1" key="$2" row="$3" trig="$4" art="$5"
  [ "$trig" = 1 ] || return 0
  if ratified "$row"; then echo "gate '$name': ratified in GATES.md, OK"; return 0; fi
  if [ "$art" = 1 ]; then echo "gate '$name': its artifact is updated in this PR (ratifying), OK"; return 0; fi
  if exempt "$key"; then echo "gate '$name': exempted in PR body (gate-exempt: $key), OK"; return 0; fi
  echo "::error::Alignment gate '$name' is triggered by this change but is not ratified in $gates. Ratify it (run the run-gate skill and set its status to ratified), or add 'gate-exempt: $key' to the PR description with a reason."
  fail=1
}

has() { printf '%s\n' "$1" | grep -qiE "$2"; }

# Stack & Architecture: a dependency manifest changed; artifact is an ADR.
has "$changed" '(^|/)(package\.json|pyproject\.toml|Cargo\.toml)$' && t=1 || t=0
has "$changed" '^docs/adr/.*\.md$' && a=1 || a=0
check "Stack & Architecture" stack "Stack & Architecture" "$t" "$a"

# Design theme: a new user-facing surface was added; artifact is DESIGN.md.
has "$added" '\.(tsx|jsx|vue|svelte)$|(^|/)(components|app|pages|screens)/' && t=1 || t=0
has "$changed" '(^|/)DESIGN\.md$' && a=1 || a=0
check "Design theme" design "Design theme" "$t" "$a"

# Deployment & Security: migrations, env files, or deploy/security docs changed.
has "$changed" '(^|/)supabase/migrations/|(^|/)\.env|(^|/)docs/(DEPLOY|SECURITY_CHECKLIST|ENVIRONMENTS)\.md$' && t=1 || t=0
has "$changed" '(^|/)docs/(DEPLOY|SECURITY_CHECKLIST)\.md$' && a=1 || a=0
check "Deployment & Security" deploy "Deployment & Security" "$t" "$a"

if [ "$fail" = 0 ]; then echo "alignment gates: OK"; exit 0; fi
echo "alignment gates: FAILED (see errors above)"; exit 1
