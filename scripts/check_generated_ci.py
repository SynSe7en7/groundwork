#!/usr/bin/env python3
"""Guard: the generated-project CI installs where the scaffold's lockfile lives.

The generated `.github/workflows/ci.yml` must run its build job in the directory
that actually holds the scaffold's package manifest and lockfile. web/mobile/
desktop keep these under their app dir; hybrid uses a pnpm workspace at the root;
the core overlay ships no build job (the existing repo keeps its own).

This regressed once silently: a static root-level `npm ci` found no lockfile and
every generated web/mobile/desktop project shipped a red CI, while the foundation
CI (which builds scaffolds via its own working-directory steps and never runs a
generated ci.yml) stayed green. CI now asserts the invariant on every change.

Stdlib only (no pip install in CI). Renders each scaffold via COPIER_CMD.

Usage:
  COPIER_CMD="uvx copier@9.16.0" python3 scripts/check_generated_ci.py
  COPIER_CMD="/path/to/copier"   python3 scripts/check_generated_ci.py
"""
import os
import subprocess
import sys
import tempfile

COPIER = os.environ.get("COPIER_CMD", "copier").split()
SRC = os.environ.get("SNAPSHOT_SRC", ".")
REF = os.environ.get("SNAPSHOT_REF", "HEAD")
CI = ".github/workflows/ci.yml"
BUILD_JOB_NAME = "name: typecheck / lint / build"

bad = []


def render(ptype, out):
    subprocess.run(
        [*COPIER, "copy", "--defaults", "--trust", "--skip-tasks", "--vcs-ref", REF,
         "--data", f"project_type={ptype}", "--data", "project_name=CIGuard", SRC, out],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True,
    )


def check(ptype):
    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, "p")
        try:
            render(ptype, out)
        except subprocess.CalledProcessError as exc:
            bad.append(f"{ptype}: render failed:\n{exc.stderr}")
            return
        path = os.path.join(out, CI)
        if not os.path.exists(path):
            bad.append(f"{ptype}: generated {CI} is missing")
            return
        ci = open(path, encoding="utf-8").read()
        # Governance jobs ship in every scaffold, including the core overlay.
        for job in ("alignment-gates:", "secret-scan:"):
            if job not in ci:
                bad.append(f"{ptype}: generated ci.yml is missing the {job} job")
        if ptype == "core":
            if BUILD_JOB_NAME in ci:
                bad.append("core: overlay should not ship a build job (the existing repo keeps its own)")
            return
        if BUILD_JOB_NAME not in ci:
            bad.append(f"{ptype}: generated ci.yml has no build job")
        if ptype == "hybrid":
            if not os.path.exists(os.path.join(out, "pnpm-lock.yaml")):
                bad.append("hybrid: pnpm-lock.yaml missing at the workspace root")
            if "pnpm install --frozen-lockfile" not in ci:
                bad.append("hybrid: ci.yml does not install the pnpm workspace at the root")
            return
        # web / mobile / desktop: lockfile under the app dir, CI scoped there.
        if not os.path.exists(os.path.join(out, ptype, "package-lock.json")):
            bad.append(f"{ptype}: package-lock.json missing under {ptype}/")
        if f"working-directory: {ptype}" not in ci:
            bad.append(f"{ptype}: ci.yml build job is not scoped to 'working-directory: {ptype}'")
        if f"cache-dependency-path: {ptype}/package-lock.json" not in ci:
            bad.append(f"{ptype}: ci.yml cache-dependency-path is not '{ptype}/package-lock.json'")


def main():
    for ptype in ("web", "mobile", "desktop", "hybrid", "core"):
        check(ptype)
    if bad:
        print("Generated-CI guard failed:")
        print("\n".join("  - " + b for b in bad))
        sys.exit(1)
    print("generated CI installs where each scaffold's lockfile lives")


if __name__ == "__main__":
    main()
