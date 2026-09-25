#!/bin/bash
# Cloud sessions start from a fresh container, so the graphify CLI (used by the
# /graphify skill and the PreToolUse hooks in settings.json) has to be reinstalled.
# The [sql] extra lets graphify read the Supabase .sql files.
set -euo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
if command -v uv >/dev/null 2>&1; then
  uv tool install "graphifyy[sql]" >/dev/null 2>&1 || true
else
  pip install --quiet "graphifyy[sql]" >/dev/null 2>&1 || true
fi
