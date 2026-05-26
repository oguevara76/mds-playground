# GitHub Pages — Playground Angular

Publica la app en la **raíz** del sitio:

| URL (ejemplo) | Qué sirve |
|---------------|-----------|
| `https://TU-USUARIO.github.io/mds-playground/` | App Angular + PrimeNG 20 |

> Sustituye `mds-playground` por el nombre real de tu repositorio.

---

## Paso 1 — Ajustar `baseHref` (solo una vez)

Edita `angular.json`, configuración **`github-pages`** → propiedad **`baseHref`**:

```json
"baseHref": "/mds-playground/"
```

Cámbialo a `/NOMBRE-DE-TU-REPO/`.

---

## Paso 2 — Compilar localmente (prueba)

```bash
cd ~/Desktop/Github/mds-playground
pnpm install
pnpm run build:pages
```

Salida: `dist/playground/browser/` (contiene `index.html`, `.js`, `.css`).

---

## Paso 3 — Montar la carpeta que subirá Pages

```bash
pnpm run build:pages
rm -rf _site
mkdir -p _site
cp -r dist/playground/browser/* _site/
```

Comprueba que `_site/index.html` existe.

---

## Paso 4 — Activar GitHub Pages

1. **Settings → Pages**
2. **Source:** GitHub Actions
3. El workflow `.github/workflows/github-pages.yml` despliega en cada push a `main` / `master`.

---

## Paso 5 — Verificar en producción

Tras el deploy, abre `https://TU-USUARIO.github.io/mds-playground/` y prueba una ruta de catálogo, por ejemplo `/button`.

---

## Playground estático (archivado)

El HTML estático anterior está en `backups/playground-static-*.zip` (incluye `index.html`, `js/`, `ejemplos/` y copia de `styles/` para restauración local).
