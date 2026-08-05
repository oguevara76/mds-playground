---
name: update-mds-core
description: >-
  Actualiza las variables core MDS del playground con diff selectivo. Usar cuando
  el usuario pide "actualizar core", "actualizar variables CSS", o sube los 4
  exports del plugin: Primitives.css, Semantic-light.css, Semantic-dark.css,
  Components.css.
---

# Actualizar core MDS

## Contrato de entrada (4 ficheros fijos)

| Fichero | Slot |
|---------|------|
| `Primitives.css` | primitivos |
| `Semantic-light.css` | semántico light |
| `Semantic-dark.css` | semántico dark |
| `Components.css` | componentes |

- Comparación de nombre **case-insensitive**
- Exactamente 4 ficheros; ni más ni menos
- Los exports pueden traer `data-theme` y metadatos con prefijos de producto/proyecto (`core--mobility--light`, `ctr--tol--dark`, etc.). El pipeline **ignora** esos prefijos en silencio y solo usa el modo light/dark. No preguntar al usuario ni añadir mapeos por producto.
- Padding de Tag/Tooltip: el export Figma trae solo ejes (`--tag-padding-x/y`, `--tooltip-padding-x/y`). No se sintetizan shorthands en apply.

## Arquitectura de capas (leer antes de actuar)

El update core **solo** sincroniza la fuente de verdad del design system. Las correcciones visuales del playground viven en capas separadas que **no se tocan** en este flujo:

| Capa | Rutas | Rol |
|------|-------|-----|
| **Core MDS** | `styles/mds-*.css` | Tokens del export Figma |
| **Puente PrimeNG** | `styles/primeng-tokens.css` | `--p-*` ← `--component-*` (+ remediación acotada) |
| **Parity** | `src/styles/primeng-*-parity.css` | Layout/comportamiento PrimeNG |
| **Overrides** | `src/app/theme/*-mds-overrides.ts` | Ajustes puntuales por componente |
| **Catálogos** | `src/app/catalogs/**` | Showcases interactivos (pueden override local, p.ej. carousel gap x16) |

**Error a evitar:** mezclar capas durante el update (p.ej. parchear parity o quitar overrides de catálogo “para alinear con Figma”). Eso rompe showcases ya corregidos.

**Aliases runtime:** Figma a veces elimina shorthands que el puente/parity siguen necesitando (`--galleria-thumbnails-content-padding`, `--stepper-separator-margin`, …). El apply **los preserva** automáticamente (`CORE_LEGACY_BRIDGE_ALIASES` en `scripts/mds_core_lib.py`).

## Flujo obligatorio (8 pasos)

### Paso 0 — Pre-validación + backup

```bash
mkdir -p .mds-core-staging
# (copiar los 4 ficheros con nombres del contrato)

python3 scripts/mds-core-preflight.py --staging .mds-core-staging/
```

Si falla → abortar. Opcional: `pnpm backup`

### Paso 1 — Diff

```bash
python3 scripts/mds-core-diff.py --staging .mds-core-staging/ --format markdown
```

Presentar al usuario:
- Resumen por colección
- Subgrupos de componentes por prefijo
- **Aliases runtime preservados** (Figma los eliminó pero el apply los conservará)
- Impacto: vars eliminadas referenciadas en playground
- Puente PrimeNG sugerido (solo vars **nuevas** con showcase)

### Paso 2 — Decisión del usuario

Usar `AskQuestion` con opciones de alcance (A–B8). Si hay bridge sugerido → pedir cuáles aprueba. **No escribir** entradas `--p-*` sin OK.

Construir `.mds-core-staging/plan.json` (ver plantilla en commits anteriores del repo).

Correcciones intencionales del playground que **no** vienen en Figma → añadir a `exclude_vars` del plan (p.ej. colores stepper activos).

### Paso 3 — Apply (solo core)

```bash
python3 scripts/mds-core-apply.py --staging .mds-core-staging/ --plan .mds-core-staging/plan.json
```

**Solo escribe:** `styles/mds-*.css` y (si aprobado en plan) entradas nuevas en `styles/primeng-tokens.css`.

**Preserva** aliases runtime eliminados por Figma. Reporta `preserved_legacy_aliases` en la salida JSON.

### Paso 3.5 — Remediación del puente (obligatorio)

```bash
pnpm run mds:remediate --apply
```

**Solo toca `styles/primeng-tokens.css`:**

- Congela vars MDS eliminadas (`BRIDGE_FROZEN_WHEN_MDS_REMOVED`)
- Sincroniza fallbacks obsoletos conocidos (`BRIDGE_STALE_FALLBACKS`, p.ej. carousel gap x4 en puente)

**No toca:** parity, overrides, catálogos, ni purga vars del core.

Si el diff no eliminó vars → dry-run con 0 fixes (OK).

### Paso 4 — Regenerar

```bash
pnpm run regen:mds
pnpm run build
```

- **`regen:primeng-dark`** — solo si el usuario aprobó entradas **nuevas** en el puente light (no ejecutar por defecto).
- **`regen:ejemplos`** — preguntar al usuario.

### Paso 5 — QA + guardia

```bash
pnpm run mds:remediate --apply   # idempotente si ya se ejecutó
pnpm run mds:qa
pnpm run mds:guard
```

`mds:guard` falla si el diff mezcla cambios en core MDS **y** capas protegidas (parity/overrides/catálogos) en la misma sesión.

Si FAIL → ofrecer restaurar backup. **No parchear parity/catálogos para “arreglar” el update.**

### Paso 6 — Cierre

Si `mds:qa` y `mds:guard` son **PASS**:

- No pedir revisión visual de Carousel/Galleria/Stepper salvo que el usuario lo pida
- Mostrar `git diff --stat` limitado a `styles/` y `src/app/theme/*.generated.ts`
- Confirmar que **no** hay cambios en `src/styles/primeng-*-parity.css` ni `src/app/catalogs/**`

## Scripts npm

```bash
pnpm run mds:preflight
pnpm run mds:diff
pnpm run mds:apply
pnpm run mds:remediate --apply
pnpm run mds:qa
pnpm run mds:guard
```

## Archivos protegidos — NO MODIFICAR en update core

- `src/app/theme/*-mds-overrides.ts`
- `src/styles/primeng-*-parity.css`
- `src/app/catalogs/**`

Si una var eliminada por Figma rompe un showcase → arreglar en **puente** (remediate) o añadir alias a `CORE_LEGACY_BRIDGE_ALIASES`, **nunca** reescribir parity/catálogo en caliente.

## Añadir alias runtime nuevo

1. Añadir `--nombre-var` a `CORE_LEGACY_BRIDGE_ALIASES` en `scripts/mds_core_lib.py`
2. Si el puente debe dejar de leerla → añadir a `BRIDGE_FROZEN_WHEN_MDS_REMOVED`
3. Si un catálogo override es intencional → `CATALOG_INTENTIONAL_MASKS`

## Componente nuevo (sin showcase)

Si el diff detecta un bloque grande de vars `--nuevo-*` sin showcase:
- Listar como INFO
- Checklist manual: ¿catálogo? ¿override? ¿parity? ¿registry?
