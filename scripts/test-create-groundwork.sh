#!/usr/bin/env bash
# Smoke test for scripts/create-groundwork.sh, focused on the bash 3.2 (macOS
# system bash) empty-array path that crashed the documented quickest-start
# (no trailing copier args -> "${EXTRA[@]}" unbound under set -u on bash < 4.4).
# Stubs uv/uvx/git/just so no real generation happens; asserts no crash and that
# extra args are forwarded to copier in order. Run under the system bash:
#   bash scripts/test-create-groundwork.sh
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
wrapper="$here/create-groundwork.sh"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
bin="$tmp/bin"
mkdir -p "$bin"
# uv/git/just are no-ops; uvx records its argv so we can assert forwarding.
for t in uv git just; do printf '#!/bin/sh\nexit 0\n' >"$bin/$t"; chmod +x "$bin/$t"; done
printf '#!/bin/sh\n: >"%s/uvx.args"\nfor a in "$@"; do printf "%%s\\n" "$a" >>"%s/uvx.args"; done\nexit 0\n' "$tmp" "$tmp" >"$bin/uvx"
chmod +x "$bin/uvx"

fails=0
run() { PATH="$bin:$PATH" GROUNDWORK_SRC="gh:test/src" bash "$wrapper" "$@" </dev/null >/dev/null 2>"$tmp/err"; }

# Case 1: no extra args (the README quickest-start). Must not crash, and uvx must
# receive exactly `copier copy --trust gh:test/src <dest>` with no empty token.
if run "$tmp/dest1"; then
  if grep -qi 'unbound variable' "$tmp/err"; then
    echo "FAIL: unbound-variable on the no-args path"; fails=1
  fi
  expected=$'copier\ncopy\n--trust\ngh:test/src\n'"$tmp/dest1"
  if [ "$(cat "$tmp/uvx.args")" != "$expected" ]; then
    echo "FAIL: no-args forwarding wrong. got:"; cat "$tmp/uvx.args"; fails=1
  fi
else
  echo "FAIL: wrapper exited non-zero with no extra args: $(cat "$tmp/err")"; fails=1
fi

# Case 2: extra copier args are forwarded in order, before the src and dest.
if run "$tmp/dest2" --data project_type=web --vcs-ref v9.9.9; then
  expected=$'copier\ncopy\n--trust\n--data\nproject_type=web\n--vcs-ref\nv9.9.9\ngh:test/src\n'"$tmp/dest2"
  if [ "$(cat "$tmp/uvx.args")" != "$expected" ]; then
    echo "FAIL: with-args forwarding wrong. got:"; cat "$tmp/uvx.args"; fails=1
  fi
else
  echo "FAIL: wrapper exited non-zero with extra args: $(cat "$tmp/err")"; fails=1
fi

if [ "$fails" -ne 0 ]; then echo "create-groundwork smoke test FAILED"; exit 1; fi
echo "create-groundwork smoke test passed (bash $BASH_VERSION)"
