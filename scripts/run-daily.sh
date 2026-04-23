#!/bin/bash
set -uo pipefail

PROJECT="/Users/andregomesfaria/Desktop/native-advertising-mvp"
LOG="$PROJECT/logs/daily-articles.log"

mkdir -p "$PROJECT/logs"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG"
}

cd "$PROJECT"

log "--- daily run start ---"

if [ ! -f .env.local ]; then
  log "ERROR: .env.local not found — add ANTHROPIC_API_KEY and GEMINI_API_KEY"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env.local
set +a

if "$PROJECT/node_modules/.bin/tsx" "$PROJECT/scripts/generate-articles.ts" >> "$LOG" 2>&1; then
  log "Generation complete"
else
  log "ERROR: generation script exited with error"
  exit 1
fi

if [ -n "$(git status --porcelain content/articles public/generated)" ]; then
  git add content/articles public/generated
  git commit -m "content: daily articles $(date '+%Y-%m-%d')" >> "$LOG" 2>&1
  git push >> "$LOG" 2>&1
  log "Committed and pushed"
else
  log "No new articles — nothing to commit"
fi

log "--- daily run end ---"
