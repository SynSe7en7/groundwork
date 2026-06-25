#!/usr/bin/env python3
"""Structural lint for groundwork skills and loops (run in CI).

Every loops/*.loop.md must declare the loop schema fields in its front-matter
(so a loop always states how it stops and what verifies it), and every
skills/*/SKILL.md must declare name and description. Keeps the playbooks honest.
"""
import glob
import re
import sys

bad = []

for f in sorted(glob.glob("template/loops/*.loop.md")):
    text = open(f, encoding="utf-8").read()
    for field in ("trigger", "goal", "checker", "exit", "handoff"):
        if not re.search(rf"(?mi)^\s*{field}\s*:", text):
            bad.append(f"{f}: missing loop field '{field}'")

for f in sorted(glob.glob("template/skills/*/SKILL.md")):
    text = open(f, encoding="utf-8").read()
    for field in ("name", "description"):
        if not re.search(rf"(?mi)^\s*{field}\s*:", text):
            bad.append(f"{f}: missing frontmatter '{field}'")

if bad:
    print("Skills/loops lint failed:")
    print("\n".join("  - " + b for b in bad))
    sys.exit(1)
print("skills and loops are well-formed")
