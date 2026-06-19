# Tema MDS en el playground Angular (PrimeNG real)

Misma arquitectura que el playground estático: **core en repo** + **upload que sobreescribe** + puente hacia PrimeNG.

## Cascada CSS (de abajo a arriba en el DOM)

| Orden | Capa | Origen |
|-------|------|--------|
| 1 | Primitivos | `styles/mds-primitives.css` |
| 2 | Puente dimensiones | `styles/mds-dimension-bridge.css` |
| 3 | Semántica light | `styles/mds-semantic-light.css` |
| 4 | Semántica dark | `styles/mds-semantic-dark.css` |
| 5 | Componentes MDS | `styles/mds-components.css` |
| 6 | Puente estático | `styles/primeng-tokens.css` |
| 7 | Shell UI | `styles/app.css` |
| 8 | Tema PrimeNG Aura | Inyectado en runtime por `@primeuix/themes` |
| 9 | **Upload primitivos** | `#user-primitives` (overwrite) |
| 10 | **Upload semántica light** | `#user-semantic-light` |
| 11 | **Upload semántica dark** | `#user-semantic-dark` |
| 12 | **Upload componentes** | `#user-components` (paddings, botones, inputs…) |
| 13 | Auto-contraste primary | `#auto-contrast` |
| 14 | **Puente runtime PrimeNG** | `#mds-prime-runtime-bridge` (~490 vars `--p-*`) |

Las capas 9–12: si subes `ejemplos/oliva/primitives.css`, cambias la rampa oliva; si subes `components.css`, cambian `--button-padding-x`, `--inputtext-*`, etc.

## Validación del upload (igual que legacy)

- Obligatorio: **primitivos** + al menos un **semántico** (light y/o dark).
- Opcional: **componentes**.
- Normalización CTR/Tol → `html[data-theme="light|dark"]` vía `css-import-normalize.ts`.

## Por qué hace falta el puente runtime (paso 14)

PrimeNG v20 genera su propio CSS **después** del build y fija muchas `--p-*` con el preset Aura. Sin el paso 14, solo primary/surface se sincronizaban y botones como **Contrast** o paddings quedaban distintos al estático.

El paso 14 se genera desde el mismo mapa que `primeng-tokens.css`:

```bash
pnpm run regen:prime-bridge
# o
pnpm run regen:mds
```

Salidas:

- `src/app/theme/prime-runtime-bridge.generated.ts`
- `src/app/theme/mds-vars-catalog.generated.ts` (vista Tokens /listado)

## Qué NO usa el Angular playground

- `styles/components.css` — réplica manual de botones; aquí los componentes son `<p-button>`, `<p-inputtext>`, etc. reales.

## Actualizar core con diff selectivo

### Contrato de export (4 ficheros fijos)

| Export del plugin | Destino en repo |
|-------------------|-----------------|
| `Primitives.css` | `styles/mds-primitives.css` |
| `Semantic-light.css` | `styles/mds-semantic-light.css` |
| `Semantic-dark.css` | `styles/mds-semantic-dark.css` |
| `Components.css` | `styles/mds-components.css` |

La nomenclatura CTR/Tol (`ctr--tol--light`, etc.) puede aparecer **dentro** del CSS exportado; el sistema la normaliza a `html[data-theme="light|dark"]` al aplicar. No forma parte del flujo del usuario.

### Guión (chat o CLI)

1. Subir los 4 ficheros al chat y pedir **"actualizar core"** (skill `update-mds-core`), o copiarlos a `.mds-core-staging/`
2. Pre-validación: `pnpm run mds:preflight`
3. Diff y resumen: `pnpm run mds:diff`
4. Decidir alcance (todo / solo modificadas / por colección / por componente / con exclusiones)
5. Apply: `pnpm run mds:apply -- --plan .mds-core-staging/plan.json`
6. Regenerar: `pnpm run regen:primeng-dark` (si hubo bridge nuevo) + `pnpm run regen:mds` + `pnpm run build`
7. QA: `pnpm run mds:qa` + checklist visual en catálogos (ToggleSwitch, InputText, Button…)

### Import rápido (todo de golpe)

```bash
# Ficheros en Desktop con nombres del contrato
./scripts/import-mds-core-from-desktop.sh
pnpm start
```

### Qué NO se modifica automáticamente

- `src/app/theme/*-mds-overrides.ts`
- `src/styles/primeng-*-parity.css`
- `src/app/catalogs/**`
- Capas de upload runtime del usuario

## Regenerar tras cambiar el core (manual)

1. Importar core: `./scripts/import-mds-core-from-desktop.sh` o flujo diff selectivo arriba
2. Regenerar datos y puente: `pnpm run regen:mds`
3. Reiniciar `pnpm start`
