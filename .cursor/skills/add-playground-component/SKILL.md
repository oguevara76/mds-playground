---
name: add-playground-component
description: >-
  Wizard guiado para incorporar un componente PrimeNG al playground MDS.
  Análisis paso a paso con confirmación del usuario en pasos 0–6 (popover,
  variables, alcance, QA). Cierra con mensaje de confirmación para el gestor.
  Usar cuando el usuario pide incorporar, añadir o crear showcase de un
  componente en el playground, o dice "continuar incorporación".
---

# Incorporar componente al playground MDS

Wizard de **7 pasos** (0–7). Detalle de preguntas: [guided-steps.md](guided-steps.md). Plantillas HTML: [reference.md](reference.md).

## Reglas del agente

1. **Un paso a la vez** — solo el paso actual + contexto mínimo.
2. **No avanzar sin respuesta** (pasos 0–6). Repetir `AskQuestion` si no hay respuesta.
3. **Alternativas + Other** en pasos 0–6 para texto libre.
4. **Resumir** lo acordado (2–3 líneas) al inicio de cada paso interactivo.
5. **Persistir** en `.mds-component-staging/session.json` tras cada decisión.
6. **Progreso** — `Paso N/7` en pasos 0–6; en el 7: **Confirmación — incorporación completada**.
7. **Paso 7 terminal** — mensaje de confirmación + texto para el gestor. **Sin `AskQuestion`.**

## Retomar sesión

Triggers: "continuar incorporación", "retomar componente".

```bash
pnpm run mds:component-session -- get
```

Reanudar en `step` con resumen previo. Ver [guided-steps.md — Retomar](guided-steps.md).

## Mapa de pasos

| Paso | Acción agente | Interacción usuario |
|------|---------------|---------------------|
| 0 | Identificar componente | AskQuestion |
| 1 | `mds:component-analyze` + proponer catálogo/referencia | AskQuestion |
| 2 | Tabla popover CONFIGURAR | AskQuestion |
| 3 | Diff variables CSS | AskQuestion (estrategia + acciones) |
| 4 | Resumen alcance + ficheros | AskQuestion |
| 5 | Implementación | Automático |
| 6 | `mds:component-qa` + `pnpm run build` | AskQuestion si FAIL; si PASS → Paso 7 |
| 7 | Mensaje confirmación + gestor | **Ninguna** |

## Comandos CLI

```bash
pnpm run mds:component-analyze -- --component {name}
pnpm run mds:component-qa -- --component {name}
pnpm run mds:component-pending -- list [--component {name}] [--open-only]
pnpm run mds:component-pending -- add --component {name} --var='--prefix-token' [--category …]
pnpm run mds:component-pending -- resolve --id {id}
pnpm run mds:component-session -- init --component {name}
pnpm run mds:component-session -- patch --json '{"catalog":"form","step":2}'
pnpm run mds:component-session -- set-step --step 3
```

Tras conectar vars nuevas al puente:

```bash
pnpm run regen:primeng-dark   # si hubo bridge nuevo
pnpm run regen:mds
pnpm run build
```

## Paso 3 — Acciones sobre variables

| Acción | Efecto |
|--------|--------|
| Crear en core | Añadir a `styles/mds-components.css` |
| Conectar puente | Añadir `--p-*` en `styles/primeng-tokens.css` |
| Ambas | Core + puente |
| Pendiente | `mds:component-pending add` |
| Omitir | Solo showcase, sin token |

Export Figma completo (4 CSS) → skill [update-mds-core](../update-mds-core/SKILL.md) en lugar de parches manuales.

## Paso 5 — Ficheros habituales

Catálogo existente (ej. `form`):

- `src/app/catalogs/{catalog}/{catalog}-catalog.config.ts`
- `src/app/catalogs/{catalog}/{catalog}-catalog.component.ts|html|css`
- `src/app/layout/playground-component-index.ts`
- `scripts/mds-component-registry.json`

Opcional: `src/app/theme/{comp}-mds-overrides.ts`, `src/styles/primeng-{comp}-parity.css`, `angular.json`.

## Paso 7 — Plantilla gestor

Incluir en el mensaje de confirmación (sin preguntar):

```markdown
## Revisión manual — nuevo componente `{Name}` en playground MDS

**Ruta:** `/{catalog}#pg-{name}`
**Estado QA automático:** PASS

### Qué revisar
- [ ] Popover CONFIGURAR funcional
- [ ] Variants & States + Sizes
- [ ] Light + dark
- [ ] Tokens en /tokens
- [ ] Pendientes en scripts/mds-component-pending.json (si aplica)

### Acción requerida
Comprobación visual final antes de dar por cerrado el componente.
```

Marcar sesión: `qa.status = "done"`, `step = 7`.

## Archivos protegidos

No modificar salvo necesidad explícita y aprobada:

- Capas upload runtime del usuario
- Catálogos/bloques no relacionados con el componente objetivo
- `src/app/theme/*` distintos del override del componente nuevo

## Integración update-mds-core

Si hay muchas vars nuevas desde Figma → redirigir a [update-mds-core](../update-mds-core/SKILL.md). El diff del core listará componentes sin showcase; este wizard cubre el showcase.
