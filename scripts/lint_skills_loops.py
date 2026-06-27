#!/usr/bin/env python3
"""Structural + content lint for groundwork skills, loops, and gates (run in CI).

Structural (the playbooks exist and declare their schema):
- every loops/*.loop.md declares trigger, goal, checker, exit, handoff;
- every skills/*/SKILL.md declares name and description.

Content (the playbooks are honest, not just present):
- a loop's `exit` declares the four concrete stop conditions (a cap, a budget, a
  no-progress rule, and a circuit breaker), with no placeholder text;
- a skill `description` is a real sentence, not a stub;
- docs/GATES.md parses, lists the five gates with a known status, and a gate
  marked `ratified` names a real artifact.

Stdlib only (no pip install in CI). Takes an optional root dir (default ".") so
the checks can be run against a fixture tree; that is how the lint is self-tested.
"""
import glob
import os
import re
import sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."

PLACEHOLDER = re.compile(r"\b(TBD|TODO|FIXME|XXX)\b|\?\?\?|to be determined", re.I)
LOOP_FIELDS = ("trigger", "goal", "checker", "exit", "handoff")
EXIT_CONCEPTS = ("cap", "budget", "progress", "breaker")
KNOWN_GATE_STATUS = {"not-started", "open", "ratified", "superseded"}

bad = []


def front_matter(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    return m.group(1) if m else ""


def field_block(fm, key):
    """Text of a top-level front-matter key's block: the key's line through the
    line before the next top-level (column-0) key."""
    lines = fm.splitlines()
    start = next((i for i, ln in enumerate(lines) if re.match(rf"^{key}\s*:", ln)), None)
    if start is None:
        return ""
    end = len(lines)
    for j in range(start + 1, len(lines)):
        if re.match(r"^[A-Za-z_]+\s*:", lines[j]):
            end = j
            break
    return "\n".join(lines[start:end])


# --- Loops ---
for f in sorted(glob.glob(os.path.join(ROOT, "template/loops/*.loop.md"))):
    fm = front_matter(open(f, encoding="utf-8").read())
    for field in LOOP_FIELDS:
        if not re.search(rf"(?mi)^\s*{field}\s*:", fm):
            bad.append(f"{f}: missing loop field '{field}'")
    exit_block = field_block(fm, "exit")
    if exit_block:
        body = "\n".join(exit_block.splitlines()[1:])  # drop the 'exit:' line
        missing = [c for c in EXIT_CONCEPTS if not re.search(c, body, re.I)]
        if missing:
            bad.append(f"{f}: exit is missing concrete stop(s): {', '.join(missing)}")
        stops = [ln for ln in body.splitlines() if re.match(r"^\s*-?\s*[A-Za-z_]+\s*:", ln)]
        if len(stops) < 4:
            bad.append(f"{f}: exit declares {len(stops)} stop(s); needs four concrete stops")
        if PLACEHOLDER.search(body):
            bad.append(f"{f}: exit contains placeholder text (TBD/TODO/...)")

# --- Skills ---
for f in sorted(glob.glob(os.path.join(ROOT, "template/skills/*/SKILL.md"))):
    fm = front_matter(open(f, encoding="utf-8").read())
    for field in ("name", "description"):
        if not re.search(rf"(?mi)^\s*{field}\s*:", fm):
            bad.append(f"{f}: missing frontmatter '{field}'")
    m = re.search(r"(?mi)^\s*description\s*:\s*(.+)$", fm)
    if m:
        desc = m.group(1).strip().strip("\"'")
        if PLACEHOLDER.search(desc):
            bad.append(f"{f}: description contains placeholder text")
        if len(desc) < 20:
            bad.append(f"{f}: description is too short to be meaningful")

# --- Gates ---
gpath = os.path.join(ROOT, "template/docs/GATES.md")
if os.path.exists(gpath):
    rows = []
    for ln in open(gpath, encoding="utf-8").read().splitlines():
        if ln.lstrip().startswith("|") and "---" not in ln:
            cols = [c.strip() for c in ln.strip().strip("|").split("|")]
            if len(cols) >= 3 and cols[0].lower() != "gate":
                rows.append(cols)
    if len(rows) < 5:
        bad.append(f"{gpath}: expected 5 gate rows, found {len(rows)}")
    for r in rows:
        gate, status, artifact = r[0], r[1].lower(), r[2]
        if status not in KNOWN_GATE_STATUS:
            bad.append(f"{gpath}: gate '{gate}' has unknown status '{status}'")
        if status == "ratified" and (not artifact or PLACEHOLDER.search(artifact)):
            bad.append(f"{gpath}: ratified gate '{gate}' names no real artifact")

if bad:
    print("Skills/loops/gates lint failed:")
    print("\n".join("  - " + b for b in bad))
    sys.exit(1)
print("skills, loops, and gates are well-formed")
