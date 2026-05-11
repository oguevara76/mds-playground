#!/usr/bin/env bash
# Importa los 4 CSS del MDS desde el Escritorio al playground.
# Requisitos: ficheros en $DESKTOP con los nombres que exporta Figma/tokens.
# Ajusta tema (ctr--tol-* → light/dark) y capa (@layer csisarqref → mds-core)
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

require "$DESKTOP/primitives.css"
require "$DESKTOP/components.css"
require "$DESKTOP/ctr--tol--light.css"
require "$DESKTOP/ctr--tol--dark.css"

transform() {
  sed -e 's/@layer csisarqref/@layer mds-core/g' \
      -e 's/html\[data-theme="ctr--tol--light"\]/html[data-theme="light"]/g' \
      -e 's/html\[data-theme="ctr--tol--dark"\]/html[data-theme="dark"]/g' \
      "$1"
}

transform "$DESKTOP/primitives.css"        > "$ROOT/styles/mds-primitives.css"
transform "$DESKTOP/components.css"        > "$ROOT/styles/mds-components.css"
transform "$DESKTOP/ctr--tol--light.css" > "$ROOT/styles/mds-semantic-light.css"
transform "$DESKTOP/ctr--tol--dark.css"  > "$ROOT/styles/mds-semantic-dark.css"

python3 "$ROOT/scripts/regen-mds-vars-data.py"

echo "Importado en $ROOT/styles/ (mds-*.css) y regenerado js/mds-vars-data.js."
