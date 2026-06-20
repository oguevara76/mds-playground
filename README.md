# MDS Playground

Playground **Angular 20 + PrimeNG 20** para previsualizar componentes con tokens MDS, upload de CSS por marca, catálogo de tokens y showcases interactivos.

El playground HTML estático (legacy) está archivado en `backups/playground-static-*.zip` para consulta o restauración local.

## Desarrollo local

```bash
cd ~/Desktop/Github/mds-playground
pnpm install
pnpm start
```

Abre en el navegador: http://localhost:3000/preview

| Documento | Contenido |
|-----------|-----------|
| [docs/FASE-0.md](docs/FASE-0.md) | Upload, `ejemplos/`, pruebas |
| [docs/TEMA-ANGULAR.md](docs/TEMA-ANGULAR.md) | Cascada MDS + puente PrimeNG |
| [docs/GITHUB-PAGES.md](docs/GITHUB-PAGES.md) | Build y publicación en Pages |

## Estructura del proyecto

```
mds-playground/
├── src/app/
│   ├── catalogs/          # Showcases por familia (button, form, menu, …)
│   ├── layout/            # Shell, sidebar, búsqueda, índice de componentes
│   ├── theme/             # Servicio de tema, overrides MDS, puente runtime generado
│   └── tokens/            # Vista /tokens y mapa de variables
├── styles/                # Core MDS versionado (primitivos → componentes + puente estático)
├── src/styles/            # Parity CSS por componente PrimeNG
├── scripts/               # Regeneración de tokens, diff/apply core, análisis de componentes
├── .cursor/
│   ├── rules/             # Reglas de comportamiento del agente (backup, modo asesor, …)
│   └── skills/            # Workflows guiados (actualizar core, incorporar componente)
├── ejemplos/              # Marcas de ejemplo (local, no en git — ver regen:ejemplos)
├── docs/
└── backups/               # ZIP locales (ignorado por git)
```

### Catálogos disponibles

| Ruta | Contenido |
|------|-----------|
| `/preview` | Vista general |
| `/button` | Botones |
| `/form` | Inputs, ToggleSwitch, FloatLabel, … |
| `/messages` | Toast, mensajes |
| `/data` | Tablas, paginador |
| `/panel` | Paneles, tabs |
| `/menu` | Menú, breadcrumb |
| `/overlay` | Dialog, tooltip, popover |
| `/misc` | Avatar, badge, chip, tag |
| `/tokens` | Mapa y listado de variables MDS |

### Capas CSS (resumen)

Primitivos → semántica light/dark → componentes MDS → `primeng-tokens.css` → upload runtime del usuario → puente runtime PrimeNG (`#mds-prime-runtime-bridge`). Detalle completo en [docs/TEMA-ANGULAR.md](docs/TEMA-ANGULAR.md).

---

## Workflows con Cursor (recomendado)

El repo incluye **skills** y **rules** en `.cursor/` para automatizar tareas frecuentes con el agente de Cursor. No hace falta memorizar los scripts: basta pedirlo en lenguaje natural.

### Incorporar un componente al playground

**En Cursor:** pide algo como *"incorporar ToggleSwitch al playground"* o *"continuar incorporación"*.

Activa la skill `add-playground-component`: wizard guiado de **7 pasos** (0–7) con confirmación en cada puerta:

| Paso | Qué ocurre |
|------|------------|
| 0 | Confirmar qué componente PrimeNG incorporar |
| 1 | Análisis + proponer catálogo y referencia |
| 2 | Definir propiedades del popover CONFIGURAR |
| 3 | Decidir acción por variable CSS (crear, puente, pendiente, omitir) |
| 4 | Aprobar alcance y ficheros a tocar |
| 5 | Implementación automática |
| 6 | QA estático + `pnpm run build` |
| 7 | Mensaje de confirmación para el gestor |

**Retomar sesión:** di *"continuar incorporación"* o *"retomar componente"*. El progreso se guarda en `.mds-component-staging/session.json`.

**CLI manual (opcional):**

```bash
pnpm run mds:component-analyze -- --component {nombre}
pnpm run mds:component-qa -- --component {nombre}
pnpm run mds:component-session -- get
```

Si faltan variables en el core, la skill puede derivar a **actualizar core** (ver abajo) antes de cerrar el paso 3.

Documentación interna: [.cursor/skills/add-playground-component/SKILL.md](.cursor/skills/add-playground-component/SKILL.md)

---

### Actualizar variables core del MDS

**En Cursor:** pide *"actualizar core"* o adjunta los **4 exports** del plugin Figma con estos nombres exactos:

| Export | Destino en repo |
|--------|-----------------|
| `Primitives.css` | `styles/mds-primitives.css` |
| `Semantic-light.css` | `styles/mds-semantic-light.css` |
| `Semantic-dark.css` | `styles/mds-semantic-dark.css` |
| `Components.css` | `styles/mds-components.css` |

Activa la skill `update-mds-core`:

1. **Pre-validación** — comprueba los 4 ficheros (`mds:preflight`)
2. **Diff** — resumen por colección, impacto en playground, puentes PrimeNG sugeridos (`mds:diff`)
3. **Decisión** — aplicas todo, solo cambios, solo nuevas, por prefijo, etc.
4. **Apply** — escribe solo `styles/mds-*.css` y (si apruebas) `styles/primeng-tokens.css`
5. **Regenerar** — `regen:primeng-dark` (si hubo puente) + `regen:mds` + `build`
6. **QA estático** — `mds:qa`
7. **Checklist visual** — revisar rutas clave en light y dark

**Antes de aplicar cambios grandes**, conviene hacer un backup (ver siguiente sección).

**CLI manual:**

```bash
mkdir -p .mds-core-staging
# Copiar los 4 CSS al staging con nombres del contrato

pnpm run mds:preflight
pnpm run mds:diff
pnpm run mds:apply    # requiere .mds-core-staging/plan.json
pnpm run mds:qa
pnpm run regen:mds
pnpm run build
```

Documentación interna: [.cursor/skills/update-mds-core/SKILL.md](.cursor/skills/update-mds-core/SKILL.md)

---

### Hacer un backup

**En Cursor:** pide *"hacer un backup"*, *"punto de control"* o *"guardar copia local"*.

**Terminal:**

```bash
pnpm backup
```

- Genera un ZIP en `backups/` con código, tokens y manifiesto (`BACKUP-MANIFEST.txt` con rama/commit).
- Rotación automática: conserva los **20 más recientes**.
- Carpeta personalizada: `BACKUP_DIR=/ruta/personalizada pnpm backup`
- Restaurar: descomprimir el ZIP en una carpeta vacía y leer el manifiesto.

La carpeta `backups/` está ignorada por git.

---

## Scripts útiles

```bash
pnpm run regen:mds          # Catálogo tokens + puente runtime PrimeNG
pnpm run regen:primeng-dark # Regenerar dark del puente estático (tras bridge nuevo)
pnpm run regen:ejemplos     # Sincronizar ejemplos/ desde core
pnpm run build:pages        # Build para GitHub Pages
pnpm run backup             # Punto de control ZIP del repo
```

### Pipeline core MDS

```bash
pnpm run mds:preflight
pnpm run mds:diff
pnpm run mds:apply
pnpm run mds:qa
```

### Pipeline incorporación de componente

```bash
pnpm run mds:component-analyze -- --component {nombre}
pnpm run mds:component-qa -- --component {nombre}
pnpm run mds:component-pending -- list
pnpm run mds:component-session -- get
```

---

## Avances recientes

| Versión / área | Qué incluye |
|----------------|-------------|
| **Workflows Cursor** | Skills guiadas para actualizar core MDS (diff selectivo + QA) e incorporar componentes PrimeNG al playground |
| **Pipeline core** | Scripts `mds-core-preflight`, `diff`, `apply`, `qa` con plan JSON y modos parciales (solo cambios, solo nuevas, por prefijo…) |
| **Tokens sincronizados** | Badge, Breadcrumb, Paginator; Form Float In; alineación padding Tag/Tooltip con export Figma |
| **Exports semánticos** | Ignora prefijos de producto/proyecto en metadatos (`core--mobility--light`, etc.) |
| **Modo asesor** | Project rule `.cursor/rules/asesor-desarrollo.mdc` — tono de asesor técnico en tareas de desarrollo (activación inteligente) |
| **Backup local** | `pnpm backup` con manifiesto git y rotación de 20 archivos |

Releases etiquetadas: `v1.0.0` … `v1.2.2` (ver [GitHub Releases](https://github.com/oguevara76/mds-playground/releases)).
