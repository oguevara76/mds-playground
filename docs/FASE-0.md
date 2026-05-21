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
- Upload CSS, paleta y tokens activos: sidebar izquierdo (paridad con legacy)

**Terminal 2 — Legacy estático (puerto 5500)**

```bash
pnpm run legacy:serve
```

- http://localhost:5500/

> En local **no** uses `http://localhost:5500/phase0/` — Fase 0 Angular va en el puerto **3000**.

---

## Fase 0 ✓ · Fase 1 ✓ (actual)

| Funcionalidad | Legacy | Angular `apps/playground` |
|---------------|--------|---------------------------|
| `<p-button>` real | No | **Sí** |
| Shell visual (topbar, sidebar, tabs) | Sí | **Sí** (`styles/app.css`) |
| Upload 4 capas CSS | Sí | **Sí** |
| Tokens activos + paleta | Sí | **Sí** |
| Dark / light | Sí | **Sí** |
| Mapa / vista Tokens completa | Sí | Pendiente |
| Resto de catálogos | Sí | Pendiente |

### Probar upload con marcas de ejemplo

Desde el sidebar de http://localhost:3000, arrastra (mínimo **primitivos** + **semántica** light o dark), por ejemplo:

- `ejemplos/azul/primitives.css`
- `ejemplos/azul/semantic-light.css`
- `ejemplos/azul/semantic-dark.css` (opcional si ya tienes light)
- `ejemplos/azul/components.css` (opcional)

Los botones PrimeNG deben actualizar colores al instante (sincroniza el preset PrimeNG vía `updatePrimaryPalette` tras cada upload).

Si no ves cambio: sube **primitivos + semántica light** (mínimo), recarga la página y vuelve a subir; comprueba que la paleta del sidebar muestre tonos oliva.

---

## Errores frecuentes

| Error | Solución |
|-------|----------|
| `ENOENT .../Users/omguevara/apps` | `cd ~/Desktop/Github/mds-playground` |
| `phase0/` 404 en :5500 | Usar http://localhost:3000 |
| Legacy en `/Desktop/Github/...` | `serve` lanzado desde `~` — reiniciar con `pnpm run legacy:serve` en el repo |

---

## GitHub Pages

[docs/GITHUB-PAGES.md](GITHUB-PAGES.md)

---

## Siguiente fase

- Vista Tokens (listado + mapa) portada de `app.js`
- Catálogo Form con componentes PrimeNG reales
- Preset generado desde `mds-*.css` (`updatePreset`)
