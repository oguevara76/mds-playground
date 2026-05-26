#!/usr/bin/env bash
# Crea un punto de control local del proyecto (ZIP con código y tokens).
#
# Uso:
#   ./scripts/create-backup.sh
#   pnpm backup
#   BACKUP_DIR=~/Backups/mds-playground ./scripts/create-backup.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"
KEEP_LAST="${KEEP_LAST:-20}"
STAMP="$(date +%Y-%m-%d_%H-%M-%S)"
PROJECT_NAME="$(basename "$ROOT")"
ARCHIVE_NAME="${PROJECT_NAME}-${STAMP}.zip"
ARCHIVE_PATH="$BACKUP_DIR/$ARCHIVE_NAME"
MANIFEST_NAME="BACKUP-MANIFEST.txt"

mkdir -p "$BACKUP_DIR"

manifest_file="$(mktemp)"
trap 'rm -f "$manifest_file"' EXIT

{
  echo "proyecto=$PROJECT_NAME"
  echo "fecha=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "ruta_origen=$ROOT"
  echo "archivo=$ARCHIVE_NAME"
  if command -v git >/dev/null 2>&1 && git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "git_branch=$(git -C "$ROOT" branch --show-current 2>/dev/null || echo "detached")"
    echo "git_commit=$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo "unknown")"
    echo "git_status_short=$(git -C "$ROOT" status -sb 2>/dev/null | head -1 || true)"
  fi
  echo ""
  echo "excluido: node_modules, dist, .angular, _site, backups, .git, caches IDE/OS"
} >"$manifest_file"

cd "$ROOT"

zip -rq "$ARCHIVE_PATH" . \
  -x "node_modules/*" \
  -x "*/node_modules/*" \
  -x "dist/*" \
  -x ".angular/*" \
  -x "_site/*" \
  -x "backups/*" \
  -x ".git/*" \
  -x ".DS_Store" \
  -x "*/.DS_Store" \
  -x ".idea/*" \
  -x ".vscode/*" \
  -x "*.log"

cp "$manifest_file" "$BACKUP_DIR/$MANIFEST_NAME"
zip -qj "$ARCHIVE_PATH" "$BACKUP_DIR/$MANIFEST_NAME"
rm -f "$BACKUP_DIR/$MANIFEST_NAME"

size_bytes="$(wc -c <"$ARCHIVE_PATH" | tr -d ' ')"
if command -v du >/dev/null 2>&1; then
  size_human="$(du -h "$ARCHIVE_PATH" | awk '{print $1}')"
else
  size_human="${size_bytes} bytes"
fi

if [[ "$KEEP_LAST" =~ ^[0-9]+$ ]] && ((KEEP_LAST > 0)); then
  count=0
  while IFS= read -r old; do
    ((count++)) || true
    if ((count > KEEP_LAST)); then
      rm -f "$old"
    fi
  done < <(ls -1t "$BACKUP_DIR"/${PROJECT_NAME}-*.zip 2>/dev/null || true)
fi

echo ""
echo "Backup creado"
echo "  Archivo: $ARCHIVE_PATH"
echo "  Tamaño:  $size_human"
echo ""
echo "Restaurar (ejemplo):"
echo "  mkdir -p /ruta/destino && unzip -q \"$ARCHIVE_PATH\" -d /ruta/destino"
echo ""
