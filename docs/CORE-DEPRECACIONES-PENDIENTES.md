# Deprecaciones core MDS — cerradas (2026-08-05)

> Fases 1–3 ejecutadas vía `scripts/mds-core-remediate.py`.

## Resumen

| Var MDS eliminada | Tratamiento en puente |
|-------------------|----------------------|
| `--galleria-*-focus-ring-style` (×4) | `--p-*` → `var(--p-focus-ring-style, solid)` |
| `--galleria-thumbnails-content-padding` | Eliminada del puente; usar `-x`/`-y` |
| `--galleria-transition-duration` | `--p-*` → `var(--p-transition-duration, 180ms)` |
| `--stepper-transition-duration` | `--p-*` → `var(--p-transition-duration, 0.2s)` |
| `--stepper-steppanel-indent` | `--p-*` → `var(--dimension-scale-x16, 1rem)` |

Parity/overrides actualizados: `primeng-galleria-parity.css`, `primeng-stepper-parity.css`, `stepper-mds-overrides.ts`.

## Próximos updates core

1. `mds:apply`
2. **`mds:remediate -- --apply`** (obligatorio)
3. `regen:primeng-dark` + `regen:mds` + `mds:qa`

Si Figma elimina nuevas vars, añadirlas a `BRIDGE_FROZEN_WHEN_MDS_REMOVED` en `scripts/mds_core_lib.py`.
