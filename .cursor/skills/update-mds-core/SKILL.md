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
- La nomenclatura CTR/Tol (`ctr--tol--light`, etc.) puede aparecer **dentro** del CSS; se normaliza en silencio. No preguntar al usuario sobre ello.
- Padding de Tag/Tooltip: el export Figma trae solo ejes (`--tag-padding-x/y`, `--tooltip-padding-x/y`). No se sintetizan shorthands en apply.

## Flujo obligatorio (7 pasos)

### Paso 0 — Pre-validación + backup

```bash
# Copiar adjuntos del chat a staging
mkdir -p .mds-core-staging
# (copiar los 4 ficheros con nombres del contrato)

python3 scripts/mds-core-preflight.py --staging .mds-core-staging/
```

Si falla → abortar y listar errores. No continuar.

Opcional antes de apply: `pnpm backup`

### Paso 1 — Diff

```bash
python3 scripts/mds-core-diff.py --staging .mds-core-staging/ --format markdown
```

Presentar al usuario:
- Resumen por colección (primitivos, sem-light, sem-dark, componentes)
- Subgrupos de componentes por prefijo (ToggleSwitch, InputText…)
- Renombrados detectados
- Impacto en playground (vars eliminadas referenciadas, cadenas var() cambiadas)
- **Puente PrimeNG sugerido** para vars nuevas de componente con showcase

### Paso 2 — Decisión del usuario

Usar `AskQuestion` con estas opciones:

| Opción | Modo |
|--------|------|
| A | Aplicar todo |
| B1 | Solo modificadas (`changed_only`) |
| B2 | Solo nuevas (`added_only`) |
| B3 | Solo eliminar deprecadas (`removed_only`) |
| B4 | Por colección |
| B5 | Combinación custom |
| B6 | Solo un prefijo de componente |
| B7 | Todo excepto lista de exclusión |
| B8 | Solo subgrupo semántico (`--form-field-*`) |

Si hay bridge sugerido → pedir cuáles aprueba explícitamente. **No escribir** entradas `--p-*` sin OK.

Construir `.mds-core-staging/plan.json`:

```json
{
  "collections": {
    "primitives": { "mode": "all" },
    "semantic-light": { "mode": "changed_only" },
    "semantic-dark": { "mode": "changed_only" },
    "components": { "mode": "add_and_changed", "exclude_removed": true }
  },
  "component_prefixes": [],
  "semantic_prefixes": [],
  "exclude_vars": ["--toggleswitch-handle-background"],
  "bridge_entries": [
    { "approved": true, "name": "--p-foo-bar", "value": "var(--foo-bar, ...)" }
  ]
}
```

### Paso 3 — Apply

```bash
python3 scripts/mds-core-apply.py --staging .mds-core-staging/ --plan .mds-core-staging/plan.json
```

Solo toca: `styles/mds-*.css` y (si aprobado) `styles/primeng-tokens.css`.
**Nunca** modificar overrides, parity ni catálogos automáticamente.

### Paso 4 — Regenerar

```bash
# Si se añadieron entradas al puente:
pnpm run regen:primeng-dark

pnpm run regen:mds
pnpm run build
```

Preguntar si ejecutar `pnpm run regen:ejemplos`.

### Paso 5 — QA estático

```bash
python3 scripts/mds-core-qa.py --format markdown
```

Si FAIL → ofrecer restaurar backup y abortar.

### Paso 6 — Checklist visual + cierre

Entregar checklist al usuario:

| Componente | Ruta | Revisar |
|------------|------|---------|
| ToggleSwitch | `/form#pg-toggleswitch` | handle off/on/hover/checked/disabled |
| InputText default | `/form#pg-inputtext` | borde, focus, invalid |
| InputText FloatLabel | variant floatlabel | over/on/in |
| InputText IftaLabel | variant iftalabel | label fija, altura |
| Button Contrast | `/button` | primary/contrast/outlined |
| WATCH tokens | sidebar inspector | primary-color, btn-fill-bg, font |

Revisar en **light y dark**. Mostrar `git diff --stat`.

## Scripts npm

```bash
pnpm run mds:preflight
pnpm run mds:diff
pnpm run mds:apply
pnpm run mds:qa
```

## Archivos protegidos (no modificar en flujo estándar)

- `src/app/theme/*-mds-overrides.ts`
- `src/styles/primeng-*-parity.css`
- `src/app/catalogs/**`
- Capas de upload runtime del usuario

## Componente nuevo (sin showcase)

Si el diff detecta un bloque grande de vars `--nuevo-*` sin showcase:
- Listar como INFO
- Checklist manual: ¿catálogo? ¿override? ¿parity? ¿registry?
