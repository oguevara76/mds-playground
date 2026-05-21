# GitHub Pages — Legacy + Fase 0 (Angular) en el mismo sitio

Puedes publicar **dos entradas** en un solo repositorio:

| URL (ejemplo) | Qué sirve |
|---------------|-----------|
| `https://TU-USUARIO.github.io/mds-playground/` | Playground **legacy** (HTML estático actual) |
| `https://TU-USUARIO.github.io/mds-playground/phase0/` | App **Angular + PrimeNG 20** (Fase 0) |

> Sustituye `mds-playground` por el nombre real de tu repositorio en todos los pasos.

---

## Paso 1 — Ajustar `base-href` (solo una vez)

El build de Pages debe conocer la subruta `/TU-REPO/phase0/`.

Edita `apps/playground/angular.json`, configuración **`github-pages`** → propiedad **`baseHref`**:

```json
"baseHref": "/mds-playground/phase0/"
```

Cámbialo a `/NOMBRE-DE-TU-REPO/phase0/`.

---

## Paso 2 — Compilar la app Angular localmente (prueba)

```bash
cd apps/playground
pnpm install
pnpm run build:pages
```

Salida: `apps/playground/dist/playground/browser/` (contiene `index.html`, `.js`, `.css`).

Abre localmente (opcional):

```bash
pnpm dlx serve dist/playground/browser -l 3333
```

La ruta base local no coincide con Pages; la prueba definitiva es el Paso 5 en GitHub.

---

## Paso 3 — Montar la carpeta que subirá Pages

Desde la **raíz del repositorio**:

```bash
# 1) Build Angular
pnpm --dir apps/playground run build:pages

# 2) Carpeta de despliegue
rm -rf _site
mkdir -p _site/phase0

# 3) Legacy en la raíz de _site (excluir apps, node_modules, _site)
rsync -a \
  --exclude apps \
  --exclude node_modules \
  --exclude _site \
  --exclude .git \
  ./ _site/

# 4) Angular dentro de phase0/
cp -r apps/playground/dist/playground/browser/* _site/phase0/
```

Comprueba:

- `_site/index.html` → legacy
- `_site/phase0/index.html` → Angular

---

## Paso 4 — Activar GitHub Pages en el repositorio

1. GitHub → tu repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions** (recomendado)  
   O bien subir `_site` manualmente a la rama `gh-pages` (menos cómodo).

Si usas **GitHub Actions**, el workflow `.github/workflows/github-pages.yml` del repo automatiza el Paso 3 en cada push a `main`.

3. Guarda. La primera ejecución puede tardar 1–3 minutos.

---

## Paso 5 — Verificar en producción

1. Abre `https://TU-USUARIO.github.io/mds-playground/`  
   - Debe cargar el playground legacy (upload, tokens, catálogos actuales).

2. Abre `https://TU-USUARIO.github.io/mds-playground/phase0/`  
   - Debe cargar la home de Fase 0 y `/phase0/button` el catálogo con `<p-button>`.

3. Si la Fase 0 sale en blanco o sin estilos:
   - Revisa **`baseHref`** (Paso 1).
   - En DevTools → Network, busca 404 en archivos `.js` / `.css`.
   - Confirma que exista la carpeta `phase0/` en el artefacto desplegado.

4. En legacy, el enlace del topbar **「Fase 0 · PrimeNG real ↗」** apunta a `phase0/`.

---

## Paso 6 — Flujo de trabajo habitual

```bash
# Cambios en legacy (raíz)
git add index.html styles/ js/
git commit -m "..."
git push

# Cambios en Angular
git add apps/playground/
git commit -m "..."
git push
# → El workflow vuelve a compilar y publicar legacy + phase0
```

---

## Despliegue manual (sin Actions)

Si no quieres Actions:

```bash
pnpm --dir apps/playground run build:pages
# Montar _site como en Paso 3
cd _site && git init && git remote add origin ... && git push -f origin main:gh-pages
```

En **Settings → Pages**, selecciona rama **`gh-pages`** y carpeta **`/` (root)**.

---

## Notas

- El legacy **no requiere compilación**; sigue funcionando como hasta ahora en la raíz.
- La Fase 0 **siempre requiere** `pnpm run build:pages` antes de publicar.
- Cuando la migración reemplace al legacy, se podrá cambiar la estrategia (solo Angular en raíz con otro `baseHref`).
