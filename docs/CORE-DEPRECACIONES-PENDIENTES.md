# Deprecaciones core MDS — pendientes de limpieza

> Creado: 2026-07-24  
> Origen: update core MDS (export 2026-07-24). Apply con `add_and_changed` + `exclude_removed`.  
> Estado: **aplazadas a propósito** — el playground aún depende de ellas.

## Contexto

El export Figma ya **no incluye** estas 8 variables en Components. Se mantuvieron en
`styles/mds-components.css` para no romper puente / parity / overrides.

No borrar del core en el próximo apply sin ejecutar el plan de abajo.

---

## Inventario

### A — Bajo riesgo (solo puente → PrimeNG)

Valor literal `solid`; el puente ya tiene fallback a `--p-focus-ring-style`.

| Var MDS | Puente `--p-*` | Uso local |
|---------|----------------|-----------|
| `--galleria-close-button-focus-ring-style` | `--p-galleria-close-button-focus-ring-style` | ninguno |
| `--galleria-indicator-button-focus-ring-style` | `--p-galleria-indicator-button-focus-ring-style` | ninguno |
| `--galleria-nav-button-focus-ring-style` | `--p-galleria-nav-button-focus-ring-style` | ninguno |
| `--galleria-thumbnail-nav-button-focus-ring-style` | `--p-galleria-thumbnail-nav-button-focus-ring-style` | ninguno |

### B — Migración a ejes (shorthand sustituido)

El export ya trae `--galleria-thumbnails-content-padding-x/y` (conectadas al puente el 2026-07-24).

| Var MDS (legacy) | Sustituto | Dependencias playground |
|------------------|-----------|-------------------------|
| `--galleria-thumbnails-content-padding` | `-x` + `-y` | `primeng-tokens.css`, `primeng-galleria-parity.css` |

### C — Sin sustituto en el export (hay que decidir valor fijo o otro token)

| Var MDS | Puente `--p-*` | Dependencias playground |
|---------|----------------|-------------------------|
| `--galleria-transition-duration` | `--p-galleria-transition-duration` | `primeng-tokens.css`, `primeng-galleria-parity.css` |
| `--stepper-steppanel-indent` | `--p-stepper-steppanel-indent` | `primeng-tokens.css`, `primeng-stepper-parity.css`, `stepper-mds-overrides.ts` |
| `--stepper-transition-duration` | `--p-stepper-transition-duration` | `primeng-tokens.css`, `primeng-stepper-parity.css` |

Nota QA: `--stepper-transition-duration` referencia `--form-field-transition-duration` (inexistente); el fallback `0.2s` salva el runtime, pero `mds-core-qa` marca FAIL.

---

## Plan recomendado (cuando se aborde)

### Fase 1 — Focus-ring Galleria (rápida)

1. En `primeng-tokens.css` (light + dark), dejar `--p-galleria-*-focus-ring-style` solo con fallback (`var(--p-focus-ring-style, solid)`), sin leer la var MDS.
2. Eliminar las 4 vars del core (`mds-components.css`).
3. `pnpm run regen:primeng-dark` + `pnpm run regen:mds` + QA.
4. Smoke visual: Galleria focus en nav / thumbnail / indicator / close (light + dark).

### Fase 2 — Padding thumbnails Galleria

1. En `primeng-galleria-parity.css`, sustituir el shorthand por:
   `padding: var(--p-galleria-thumbnails-content-padding-y) var(--p-galleria-thumbnails-content-padding-x)`
   (o cascada MDS → `--p-*` → valor fijo).
2. Quitar del puente la entrada `--p-galleria-thumbnails-content-padding` (shorthand).
3. Eliminar `--galleria-thumbnails-content-padding` del core.
4. Regen + QA + smoke thumbnails.

### Fase 3 — Transition / indent sin sustituto Figma

Decisión de diseño (no inventar en playground):

- **Opción X:** congelar valor en el puente (`180ms`, `0.2s`, `1rem`) y borrar del core.
- **Opción Y:** pedir al plugin que vuelva a exportar esos tokens (o equivalentes semánticos).
- **Opción Z:** mapear a un token semántico/global existente (`--p-transition-duration`, spacing scale).

Luego, en el mismo PR: puente + parity + override Stepper + borrado core + regen + QA.

Orden sugerido dentro de la fase: primero Galleria transition, después Stepper (indent + transition; al tocar transition se puede cerrar el FAIL de QA).

### Fase 4 — Cierre

1. Apply futuro con `removed_only` (o `all`) para esas 8 ya no debe reportar impacto en playground.
2. Actualizar este doc: marcar ítems como hechos o borrarlo si queda vacío.
3. `pnpm run regen:ejemplos` si el core de componentes cambió.

---

## No hacer

- Borrar solo core y dejar el puente apuntando a vars inexistentes.
- Mezclar este cleanup con un update core grande de Figma (diff ruidoso).
- Recrear las vars “a mano” en el playground para silenciar QA: la fuente de verdad sigue siendo el export.

---

## Checklist al retomar

- [ ] Fase 1 focus-ring
- [ ] Fase 2 padding → ejes
- [ ] Fase 3 transition/indent (decisión X/Y/Z)
- [ ] QA global PASS (incl. stepper)
- [ ] Checklist visual Galleria + Stepper light/dark
- [ ] Cerrar este documento
