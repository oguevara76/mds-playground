#!/usr/bin/env bash
# Importa los 4 CSS del MDS desde el Escritorio al playground.
# Requisitos: ficheros en $DESKTOP con los nombres que exporta Figma/tokens.
# Ajusta tema (ctr--its-* | ctr--tol-* → light/dark) y capa (@layer csisarqref → mds-core)
# para que sigan funcionando index.html y js/app.js (data-theme="light"|"dark").
#
# Uso:
#   ./scripts/import-mds-core-from-desktop.sh
#   DESKTOP=~/Descargas ./scripts/import-mds-core-from-desktop.sh

set -euo pipefail

DESKTOP="${DESKTOP:-$HOME/Desktop}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

require() {
  local p="$1"
  if [[ ! -f "$p" ]]; then
    echo "No existe: $p" >&2
    exit 1
  fi
}

pick_semantic_light() {
  if [[ -f "$DESKTOP/ctr--its--light.css" ]]; then echo "$DESKTOP/ctr--its--light.css"
  elif [[ -f "$DESKTOP/ctr--tol--light.css" ]]; then echo "$DESKTOP/ctr--tol--light.css"
  else echo ""; fi
}

pick_semantic_dark() {
  if [[ -f "$DESKTOP/ctr--its--dark.css" ]]; then echo "$DESKTOP/ctr--its--dark.css"
  elif [[ -f "$DESKTOP/ctr--tol--dark.css" ]]; then echo "$DESKTOP/ctr--tol--dark.css"
  else echo ""; fi
}

require "$DESKTOP/primitives.css"
require "$DESKTOP/components.css"

LIGHT_SRC="$(pick_semantic_light)"
DARK_SRC="$(pick_semantic_dark)"
[[ -n "$LIGHT_SRC" ]] || { echo "Falta semántica light: $DESKTOP/ctr--its--light.css o ctr--tol--light.css" >&2; exit 1; }
[[ -n "$DARK_SRC" ]]  || { echo "Falta semántica dark:  $DESKTOP/ctr--its--dark.css o ctr--tol--dark.css" >&2; exit 1; }

transform() {
  sed -e 's/@layer csisarqref/@layer mds-core/g' \
      -e 's/html\[data-theme="ctr--its--light"\]/html[data-theme="light"]/g' \
      -e 's/html\[data-theme="ctr--its--dark"\]/html[data-theme="dark"]/g' \
      -e 's/html\[data-theme="ctr--tol--light"\]/html[data-theme="light"]/g' \
      -e 's/html\[data-theme="ctr--tol--dark"\]/html[data-theme="dark"]/g' \
      "$1"
}

transform "$DESKTOP/primitives.css" > "$ROOT/styles/mds-primitives.css"
transform "$DESKTOP/components.css" > "$ROOT/styles/mds-components.css"
transform "$LIGHT_SRC" > "$ROOT/styles/mds-semantic-light.css"
transform "$DARK_SRC"  > "$ROOT/styles/mds-semantic-dark.css"

python3 "$ROOT/scripts/regen-mds-vars-data.py"

echo "Importado en $ROOT/styles/ (mds-*.css) y regenerado js/mds-vars-data.js."
echo "  light: $(basename "$LIGHT_SRC")"
echo "  dark:  $(basename "$DARK_SRC")"
