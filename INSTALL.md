# Installing groundwork

groundwork can start a new project or add its governance layer to an existing
one. Both paths use Copier through `uvx`, so nothing is installed globally.

## Prerequisites

- `uv` (provides `uvx`). If `uvx --version` fails, install it:
  `curl -LsSf https://astral.sh/uv/install.sh | sh` (then restart the shell).
- Access to the repo. It is private, so you are authenticated via `gh` or a
  GitHub token in the environment.

## New project (full scaffold)

```
uvx copier copy --trust gh:SynSe7en7/groundwork ./my-new-project
```

Answer the questionnaire (name, type web/mobile/desktop/hybrid, Supabase, Modal,
license). This writes a runnable app skeleton plus the governance layer, and a
`.copier-answers.yml` so future updates can be merged in.

## Existing project (governance overlay)

Adds AGENTS.md, the alignment gates, the committed-decision docs, hygiene, and
the advisory CI to a repo you already have, without touching your app code. Run
from the repo root:

```
cd /path/to/your/repo
uvx copier copy --trust --data project_type=core gh:SynSe7en7/groundwork .
```

- `project_type=core` adds only the stack-neutral governance layer. No app
  scaffold, no Supabase migrations.
- Any file you already have (AGENTS.md, .gitignore, README.md, CI, and the rest)
  is skipped, never overwritten.
- No commit is made; review the new files and commit them yourself.

Then: fill in `CHARTER.md` (the upfront gate), fill the Commands in `AGENTS.md`,
and read `docs/GATES.md` for the alignment gates.

## For an AI coding agent

If you are an AI agent adding groundwork to the current repository, do this:

1. Confirm `uv` is available. If `uvx --version` fails, run
   `curl -LsSf https://astral.sh/uv/install.sh | sh` and re-source the shell.
2. From the repository root, run (set the project name):

   ```
   uvx copier copy --trust --defaults \
     --data project_type=core \
     --data project_name="<this project's name>" \
     gh:SynSe7en7/groundwork .
   ```

   `--defaults` answers the rest non-interactively; `_skip_if_exists` protects
   every existing file, so this is safe to run on a populated repo.
3. Read the generated `AGENTS.md` and follow it for the rest of the session.
4. Open `CHARTER.md` and `docs/GATES.md`. If `CHARTER.md` is still a template,
   interview the user to fill it before other substantive work (the Charter
   gate is the one upfront gate).
5. Commit the new files on a feature branch and open a PR. Do not commit
   directly to the default branch.

## Updating later

```
just foundation-update            # 3-way merge the latest groundwork release in
just foundation-update-to vX.Y.Z  # pin to a version
```

Requires a clean working tree. Resolve any conflict markers, then `just verify`.
