#!/usr/bin/env python3
"""Golden-output snapshots: catch unintended drift in generated content.

CI checks file PRESENCE; this checks file CONTENT. For each scaffold we render
it deterministically and record a sorted `sha256  relpath` manifest under
tests/golden/<scaffold>.manifest. CI re-renders and diffs against the committed
manifest, so any added, removed, or content-changed file becomes a reviewable
failure. When a change is intentional, run `update` and commit the new manifests
in the same PR (the diff is the review signal).

Determinism: rendered with --skip-tasks (no git, no slug substitution) and a
fixed project name, so the output is byte-stable. .copier-answers.yml is excluded
(its _commit and _src_path vary by ref and source).

Usage:
  COPIER_CMD="uvx copier@9.16.0" python3 scripts/snapshot.py check    # fail on drift
  COPIER_CMD="/path/to/copier"   python3 scripts/snapshot.py update   # regenerate

Env: SNAPSHOT_SRC (default "."), SNAPSHOT_REF (default "HEAD"), COPIER_CMD.
"""
import difflib
import hashlib
import os
import subprocess
import sys
import tempfile

SCAFFOLDS = ["web", "mobile", "desktop", "hybrid", "core"]
SRC = os.environ.get("SNAPSHOT_SRC", ".")
REF = os.environ.get("SNAPSHOT_REF", "HEAD")
COPIER = os.environ.get("COPIER_CMD", "copier").split()
GOLDEN_DIR = "tests/golden"
EXCLUDE = {".copier-answers.yml"}


def render(scaffold, out):
    subprocess.run(
        [*COPIER, "copy", "--defaults", "--trust", "--skip-tasks", "--vcs-ref", REF,
         "--data", f"project_type={scaffold}", "--data", "project_name=Snapshot",
         SRC, out],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True,
    )


def manifest_for(out):
    lines = []
    for root, dirs, files in os.walk(out):
        dirs.sort()
        for fn in files:
            full = os.path.join(root, fn)
            rel = os.path.relpath(full, out)
            if rel in EXCLUDE:
                continue
            digest = hashlib.sha256(open(full, "rb").read()).hexdigest()
            lines.append(f"{digest}  {rel}")
    return "\n".join(sorted(lines)) + "\n"


def build(scaffold):
    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, "proj")
        try:
            render(scaffold, out)
        except subprocess.CalledProcessError as exc:
            print(f"render failed for {scaffold}:\n{exc.stderr}", file=sys.stderr)
            raise
        return manifest_for(out)


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "check"
    os.makedirs(GOLDEN_DIR, exist_ok=True)
    failures = []
    for scaffold in SCAFFOLDS:
        got = build(scaffold)
        path = os.path.join(GOLDEN_DIR, f"{scaffold}.manifest")
        if mode == "update":
            open(path, "w").write(got)
            print(f"updated {path} ({got.strip().count(chr(10)) + 1} files)")
            continue
        if not os.path.exists(path):
            failures.append(f"{scaffold}: no committed manifest at {path} (run 'update')")
            continue
        want = open(path).read()
        if got != want:
            failures.append(f"{scaffold}: generated content drifted from {path}")
            diff = "\n".join(difflib.unified_diff(
                want.splitlines(), got.splitlines(),
                fromfile=f"{path} (committed)", tofile=f"{scaffold} (rendered)",
                lineterm=""))
            print(diff[:4000])
    if mode != "update":
        if failures:
            print("Golden snapshot drift:")
            print("\n".join("  - " + f for f in failures))
            sys.exit(1)
        print("golden snapshots match for all scaffolds")


if __name__ == "__main__":
    main()
