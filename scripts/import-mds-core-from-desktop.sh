#!/usr/bin/env bash
# Importa los 4 CSS del MDS al playground (contrato de nombre fijo).
#
# Ficheros esperados en $DESKTOP:
#   Primitives.css, Semantic-light.css, Semantic-dark.css, Components.css
#
# Uso:
#   ./scripts/import-mds-core-from-desktop.sh
#   DESKTOP=~/Descargas ./scripts/import-mds-core-from-desktop.sh

set -euo pipefail

DESKTOP="${DESKTOP:-$HOME/Desktop}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGING="$ROOT/.mds-core-staging"

require() {
  local p="$1"
  if [[ ! -f "$p" ]]; then
    echo "No existe: $p" >&2
    echo "Contrato: Primitives.css, Semantic-light.css, Semantic-dark.css, Components.css" >&2
    exit 1
  fi
}

pick_file() {
  local base="$1"
  if [[ -f "$DESKTOP/$base" ]]; then
    echo "$DESKTOP/$base"
    return
  fi
  local lower
  lower="$(echo "$base" | tr '[:upper:]' '[:lower:]')"
  if [[ -f "$DESKTOP/$lower" ]]; then
    echo "$DESKTOP/$lower"
    return
  fi
  echo ""
}

mkdir -p "$STAGING"

for name in Primitives.css Semantic-light.css Semantic-dark.css Components.css; do
  src="$(pick_file "$name")"
  [[ -n "$src" ]] || { echo "Falta: $name en $DESKTOP" >&2; exit 1; }
  cp "$src" "$STAGING/$name"
done

python3 "$ROOT/scripts/mds-core-preflight.py" --staging "$STAGING"
python3 "$ROOT/scripts/mds-core-apply.py" --staging "$STAGING" --mode all
python3 "$ROOT/scripts/regen-primeng-dark-from-light.py"
python3 "$ROOT/scripts/regen-mds-vars-data.py"
python3 "$ROOT/scripts/regen-prime-runtime-bridge.py"
python3 "$ROOT/scripts/mds-core-qa.py" --format markdown || true

echo "Importado en $ROOT/styles/ (mds-*.css) y regenerado catálogo + puente runtime."
echo "  staging: $STAGING"
echo "  Siguiente: pnpm start (puerto 3000) y revisar checklist visual"
