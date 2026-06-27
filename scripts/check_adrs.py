#!/usr/bin/env python3
"""Integrity check for the foundation's Architecture Decision Records (run in CI).

Enforces what was honor-system:
- every docs/adr/NNNN-*.md declares a Status, and it is a known one;
- docs/adr/README.md (the index) lists every ADR and only existing ADRs, with a
  status that matches the ADR file;
- a `superseded` ADR names its successor ("Superseded by NNNN").

Stdlib only (no CI dependency). Optional root arg (default ".") so it can run
against a fixture tree; that is how it is self-tested.
"""
import glob
import os
import re
import sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
ADR_DIR = os.path.join(ROOT, "docs/adr")
INDEX = os.path.join(ADR_DIR, "README.md")
VALID = {"proposed", "accepted", "superseded", "deprecated", "rejected"}

bad = []


def status_of(text):
    m = re.search(r"(?mi)^[-*]?\s*Status:\s*([A-Za-z]+)", text)
    return m.group(1).lower() if m else None


# Collect ADR files named NNNN-*.md (skips README.md, _TEMPLATE.md, etc.).
adrs = {}
for f in sorted(glob.glob(os.path.join(ADR_DIR, "*.md"))):
    base = os.path.basename(f)
    m = re.match(r"(\d{4})-.*\.md$", base)
    if not m:
        continue
    num = m.group(1)
    text = open(f, encoding="utf-8").read()
    st = status_of(text)
    adrs[num] = (base, st)
    if st is None:
        bad.append(f"{base}: no Status line")
    elif st not in VALID:
        bad.append(f"{base}: invalid status '{st}' (expected one of {', '.join(sorted(VALID))})")
    if st == "superseded" and not re.search(r"(?i)superseded by\s+\d{4}", text):
        bad.append(f"{base}: status is superseded but it names no successor ('Superseded by NNNN')")

# Index checks.
if not os.path.exists(INDEX):
    bad.append("docs/adr/README.md (the ADR index) is missing")
else:
    itext = open(INDEX, encoding="utf-8").read()
    indexed = {n: s.lower() for n, s in
               re.findall(r"\|\s*\[?(\d{4})\]?[^|]*\|[^|]*\|\s*([A-Za-z-]+)\s*\|", itext)}
    for num, (base, st) in adrs.items():
        if num not in indexed:
            bad.append(f"ADR {num} ({base}) is not listed in docs/adr/README.md")
        elif st and indexed[num] != st:
            bad.append(f"ADR {num}: index status '{indexed[num]}' does not match file status '{st}'")
    for num in indexed:
        if num not in adrs:
            bad.append(f"docs/adr/README.md lists ADR {num} but no matching file exists")

if bad:
    print("ADR integrity check failed:")
    print("\n".join("  - " + b for b in bad))
    sys.exit(1)
print(f"ADRs well-formed and indexed ({len(adrs)} records)")
