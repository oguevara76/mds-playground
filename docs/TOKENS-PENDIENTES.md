# Tokens pendientes de exportar desde el plugin Figma

> Última revisión: 2026-07-13  
> Contexto: QA tras actualización core MDS v1.0.0

Este documento recoge las variables CSS referenciadas en los archivos de override
(`src/app/theme/*-mds-overrides.ts`) que **no están definidas en el core MDS exportado**
ni en el tema Aura de PrimeNG. El script `mds-core-qa.py` las reporta como `override_refs_warn`.

---

## Por qué no se crean manualmente en el playground

Los overrides usan un patrón de fallback en tres capas:

```css
/* Capa 1: token MDS  →  Capa 2: token PrimeNG bridge  →  Capa 3: valor px de seguridad */
property: var(--mds-token, var(--p-primeng-token, 14px));
```

Declarar el token MDS en el playground rompe esta arquitectura:
el valor quedaría congelado en el repo y entraría en conflicto con el export siguiente del plugin.
**La fuente de verdad es siempre el plugin Figma → export → `mds:apply`.**

---

## Tokens pendientes de añadir al plugin Figma

### `--surface-context-muted`

- **Colección destino:** Semantic (light y dark)
- **Descripción:** Superficie de texto apagada / muted. Equivalente semántico a un gray-500 contextual.
- **Usado en:** `avatar-mds-overrides.ts` — color del texto del avatar de overflow (`+N`)
- **Cadena de fallback actual:**
  ```
  --avatar-group-overflow-color
    → --surface-context-muted        ← FALTA
      → --p-surface-500 = #71717a    ← resuelve aquí (gris PrimeNG, no MDS)
  ```
- **Impacto:** El texto del chip `+N` en AvatarGroup usa `#71717a` en lugar del tono semántico MDS.

---

### `--avatar-group-overflow-background`

- **Colección destino:** Components
- **Descripción:** Fondo del avatar de overflow en AvatarGroup.
- **Usado en:** `avatar-mds-overrides.ts`
- **Cadena de fallback actual:**
  ```
  --avatar-group-overflow-background
    → --surface-context-subtle        ← RESUELVE (definida en mds-semantic-dark.css)
  ```
- **Impacto:** Ninguno visible. Resuelve en `--surface-context-subtle`. Se documenta
  para completar el token cuando se formalice el componente Avatar en el plugin.

---

### `--avatar-group-overflow-color`

- **Colección destino:** Components
- **Descripción:** Color de texto del avatar de overflow en AvatarGroup.
- **Usado en:** `avatar-mds-overrides.ts`
- **Cadena de fallback actual:** ver `--surface-context-muted` arriba.
- **Impacto:** Leve (mismo que `--surface-context-muted`).

---

### `--chip-font-size`

- **Colección destino:** Components
- **Descripción:** Tamaño de fuente del componente Chip.
- **Usado en:** `chip-mds-overrides.ts`
- **Cadena de fallback actual:**
  ```
  --chip-font-size
    → --p-chip-font-size = var(--p-font-size)   ← resuelve aquí (bridge playground)
      → --p-font-size = 14px
  ```
- **Impacto:** Ninguno. Resuelve correctamente. Se documenta para cuando el plugin
  exporte el token tipográfico de Chip.
- **Nota PrimeNG:** Se espera una actualización del sistema tipográfico de PrimeNG en 2026.
  No conviene anticipar este token hasta conocer los nombres definitivos del nuevo sistema.

---

### `--surface-border`

- **Colección destino:** Semantic (light y dark)
- **Descripción:** Color de borde de superficie. Token semántico legacy.
- **Usado en:** `overlay-mds-overrides.ts` (segundo fallback del divisor en popovers)
- **Cadena de fallback actual:**
  ```
  --p-content-border = var(--content-border-color, var(--p-surface-200))   ← resuelve aquí
    → --surface-border    ← NUNCA SE EVALÚA
  ```
- **Impacto:** Ninguno. El primer fallback `--p-content-border` siempre resuelve.
  Baja prioridad.

---

## Tabla resumen

| Token | Colección | Impacto actual | Prioridad |
|-------|-----------|---------------|-----------|
| `--surface-context-muted` | Semantic | Leve — gris PrimeNG en texto `+N` | Alta |
| `--avatar-group-overflow-color` | Components | Leve (depende del anterior) | Alta |
| `--avatar-group-overflow-background` | Components | Ninguno | Media |
| `--chip-font-size` | Components | Ninguno | Baja (esperar actualización tipográfica PrimeNG 2026) |
| `--surface-border` | Semantic | Ninguno | Baja |

---

## Nota sobre la actualización tipográfica de PrimeNG (2026)

PrimeNG tiene previsto unificar su sistema tipográfico en 2026, posiblemente cambiando
los nombres de tokens como `--p-font-size`, `--p-font-size-sm`, etc.

El patrón de bridge del playground absorbe ese cambio en una sola línea de `primeng-tokens.css`.
No crear tokens tipográficos MDS (`--chip-font-size`, etc.) antes de que:
1. El plugin Figma los exporte con valores definitivos
2. Se conozcan los nombres finales del nuevo sistema PrimeNG

De lo contrario se crearía un token congelado que no seguiría la actualización automáticamente.
