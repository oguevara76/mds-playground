# MDS Playground — Angular + PrimeNG 20

## Entrar al repo (obligatorio)

```bash
cd ~/Desktop/Github/mds-playground
```

## Desarrollo local

**Terminal 1 — Angular (PrimeNG real, puerto 3000)**

```bash
pnpm run setup
pnpm run playground:start
```

- Catálogo Button: http://localhost:3000/button  
- Catálogo Form: http://localhost:3000/form  
- Catálogo Messages: http://localhost:3000/messages  
- Catálogo Data: http://localhost:3000/data  
- Catálogo Panel: http://localhost:3000/panel  
- Catálogo Overlay: http://localhost:3000/overlay  
- Catálogo Misc (Tag): http://localhost:3000/misc  
- Upload CSS, paleta y tokens activos: sidebar izquierdo (paridad con legacy)

**Terminal 2 — Legacy estático (puerto 5500)**

```bash
pnpm run legacy:serve
```

- http://localhost:5500/

> En local **no** uses `http://localhost:5500/phase0/` — Fase 0 Angular va en el puerto **3000**.

---

## Fase 0 ✓ · Fase 1 ✓ · Fase 2 ✓ Form · Fase 3 ✓ Messages · Fase 4 ✓ Data + Panel · Fase 5 ✓ Overlay (actual)

| Funcionalidad | Legacy | Angular `apps/playground` |
|---------------|--------|---------------------------|
| `<p-button>` real | No | **Sí** (`/button`) |
| Catálogo Form (Radio, Checkbox, ToggleSwitch, InputText) | Sí | **Sí** (`/form`) |
| Catálogo Messages (`p-message` + Toast) | Sí | **Sí** (`/messages`) |
| Catálogo Data (Paginator) | Sí | **Sí** (`/data`) |
| Catálogo Panel (Tabs) | Sí | **Sí** (`/panel`) |
| Catálogo Overlay (Tooltip) | Sí | **Sí** (`/overlay`) |
| Catálogo Misc (Tag) | Sí | **Sí** (`/misc`) |
| Shell visual (topbar, sidebar, tabs) | Sí | **Sí** (`styles/app.css`) |
| Upload 4 capas CSS | Sí | **Sí** |
| Tokens activos + paleta | Sí | **Sí** |
| Dark / light | Sí | **Sí** |
| Mapa / vista Tokens completa | Sí | Pendiente |
| Data / Panel catálogos | Sí | **Sí** |

### Probar upload con marcas de ejemplo

Hay **dos copias** de las marcas de ejemplo (mismo contenido tras `pnpm run regen:ejemplos`):

| Playground | Carpeta |
|------------|---------|
| Legacy (HTML, puerto 5500) | `ejemplos/` en la raíz del repo |
| Angular (puerto 3000) | `apps/playground/ejemplos/` |

Desde el sidebar de http://localhost:3000, arrastra (mínimo **primitivos** + **semántica** light o dark), por ejemplo:

- `apps/playground/ejemplos/azul/primitives.css`
- `apps/playground/ejemplos/azul/semantic-light.css`
- `apps/playground/ejemplos/azul/semantic-dark.css` (recomendado junto con light para el toggle)
- `apps/playground/ejemplos/azul/components.css` (opcional)

En el legacy usa la misma estructura bajo `ejemplos/azul/…`.

Los botones PrimeNG deben actualizar colores al instante. Cadena de estilos (último gana en `<p-button>`):

1. `styles/mds-components.css` + `user-components` (upload) → `--button-*`
2. `styles/primeng-tokens.css` → puente `--p-button-*` ← `--button-*`
3. Tema Aura PrimeNG (solo paleta base)
4. `mds-prime-runtime-bridge` → reaplica `--p-button-*` desde MDS
5. **`mds-button-overrides`** → fuerza filled + outlined + text con `var(--button-*)` y `!important`

Tras cada upload se llama `resyncThemeRuntime()`; el inspector muestra `btn-fill-bg`, `btn-text-sec`, `btn-out-danger` para validar.

Si no ves cambio: sube **primitivos + semántica light** (mínimo), recarga la página y vuelve a subir; comprueba que la paleta del sidebar muestre tonos oliva.

### Modo oscuro en el legacy

Los estilos de componentes del HTML estático dependen de `--p-*` definidos en `styles/primeng-tokens.css` **por tema**. El bloque `html[data-theme="dark"]` debe incluir los mismos tokens que el bloque light (mensajes, tabs, paginator, etc.); si faltan, en dark se pierden fondos, bordes y tipografía.

Tras ampliar el bloque light, sincroniza dark:

```bash
pnpm run regen:primeng-dark
```

El script conserva al final del bloque dark las variables de **shell** (`--app-bg`, `--sidebar-bg`, `--topbar-*`). Sin ellas, en modo oscuro el body y la barra lateral quedan sin fondo y la interfaz contenedora se ve rota.

Sube **semantic-light y semantic-dark** (o ninguna semántica, para usar el core MDS) y usa el toggle Dark/Light en la topbar.

---

## Errores frecuentes

| Error | Solución |
|-------|----------|
| `ENOENT .../Users/omguevara/apps` | `cd ~/Desktop/Github/mds-playground` |
| `phase0/` 404 en :5500 | Usar http://localhost:3000 |
| Legacy en `/Desktop/Github/...` | `serve` lanzado desde `~` — reiniciar con `pnpm run legacy:serve` en el repo |
| Componentes rotos solo en **Dark** (legacy) | Comprobar `primeng-tokens.css` bloque dark; ejecutar `pnpm run regen:primeng-dark` |

---

## GitHub Pages

[docs/GITHUB-PAGES.md](GITHUB-PAGES.md)

---

## Siguiente fase

- Vista Tokens: listado + mapa ✓ (`/tokens`)
- ~~Catálogos Data y Panel~~ ✓ (`/data`, `/panel`)
- ~~Catálogo Overlay (Tooltip)~~ ✓ (`/overlay`)
- ~~Toast interactivo en Messages~~ ✓ (`app-toast-catalog` en `/messages`)
- Preset generado desde `mds-*.css` (`updatePreset`)
