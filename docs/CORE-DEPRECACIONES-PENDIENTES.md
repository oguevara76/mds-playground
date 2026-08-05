# Deprecaciones core MDS — pipeline post-update

## Flujo correcto (sin tocar componentes)

```bash
pnpm run mds:preflight
pnpm run mds:diff
pnpm run mds:apply          # solo styles/mds-*.css
pnpm run mds:remediate --apply   # solo styles/primeng-tokens.css
pnpm run regen:mds
pnpm run mds:qa
pnpm run mds:guard
```

## Qué hace cada capa

| Paso | Archivos | Alcance |
|------|----------|---------|
| **apply** | `styles/mds-*.css` | Sync con export Figma; preserva aliases runtime |
| **remediate** | `styles/primeng-tokens.css` | Congela vars eliminadas; fallbacks conocidos |
| **regen:mds** | `*.generated.ts` | Catálogo + puente runtime |
| **NO tocar** | parity, overrides, catálogos | Correcciones visuales del playground |

## Vars MDS eliminadas por Figma → puente congelado

| Var MDS eliminada | Tratamiento en puente |
|-------------------|----------------------|
| `--galleria-*-focus-ring-style` (×4) | `--p-*` → `var(--p-focus-ring-style, solid)` |
| `--galleria-transition-duration` | `--p-*` → `var(--p-transition-duration, 180ms)` |
| `--stepper-transition-duration` | `--p-*` → `var(--p-transition-duration, 0.2s)` |

## Aliases runtime preservados en core (aunque Figma los elimine)

Definidos en `CORE_LEGACY_BRIDGE_ALIASES` (`scripts/mds_core_lib.py`):

- `--galleria-thumbnails-content-padding`
- `--stepper-separator-margin`
- `--stepper-steppanel-indent`
- `--stepper-steppanels-padding`

## Overrides intencionales en catálogos (no son errores)

- `/media` carousel: `--carousel-content-gap: x16` (core = x4)
- `/media` galleria: padding thumbnails compuesto en host

Registrados en `CATALOG_INTENTIONAL_MASKS`.

## Próximos updates

1. Si Figma elimina una var referenciada en parity → añadir a `BRIDGE_FROZEN_WHEN_MDS_REMOVED` o `CORE_LEGACY_BRIDGE_ALIASES`
2. **No** parchear parity/catálogos durante el update
3. `regen:primeng-dark` solo tras entradas **nuevas** aprobadas en el puente light
