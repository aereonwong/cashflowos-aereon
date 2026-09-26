#!/bin/bash
# Cloud sessions start from a fresh container, so the graphify CLI (used by the
# /graphify skill and the PreToolUse hooks in settings.json) and markitdown have
# to be reinstalled.
# The [sql] extra lets graphify read the Supabase .sql files.
set -euo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
# markitdown turns PDFs, Word, Excel, PowerPoint and images into Markdown Claude can read.
for pkg in "graphifyy[sql]" "markitdown[all]"; do
  if command -v uv >/dev/null 2>&1; then
    uv tool install "$pkg" >/dev/null 2>&1 || true
  else
    pip install --quiet "$pkg" >/dev/null 2>&1 || true
  fi
done
