# MDS Playground

Vista previa en vivo de componentes PrimeNG con soporte para cargar tokens CSS personalizados desde un design system.

## ✨ Funcionalidades

- **Upload de CSS** — Arrastra o selecciona un fichero de tokens para sobreescribir las variables de PrimeNG en tiempo real
- **Token inspector** — Visualización en vivo de los custom properties activos
- **Paleta de color** — Preview de la rampa de color primaria
- **4 secciones de preview**: Componentes · Formularios · Dashboard · Layouts
- **Dark / Light mode** — Toggle entre modos de tema
- **Sin build step** — HTML + CSS + JS puro, funciona directamente en el navegador

## Angular + PrimeNG v20 (`apps/playground/`)

App con **`<p-button>` real**, shell visual del legacy, **upload de CSS** y paleta/tokens en sidebar. El HTML estático de la raíz **no se sustituye**.

| Documento | Contenido |
|-----------|-----------|
| [docs/FASE-0.md](docs/FASE-0.md) | Desarrollo local, upload, pruebas con `ejemplos/` |
| [docs/TEMA-ANGULAR.md](docs/TEMA-ANGULAR.md) | Cascada core MDS + upload + puente PrimeNG (todos los componentes) |
| [docs/GITHUB-PAGES.md](docs/GITHUB-PAGES.md) | Compilar y publicar legacy + `/phase0/` en Pages |

```bash
cd ~/Desktop/Github/mds-playground
pnpm run setup && pnpm run playground:start   # http://localhost:3000/button
pnpm run legacy:serve                          # otra terminal → http://localhost:5500/
```

---

## 📁 Estructura del proyecto

```
mds-playground/
├── apps/playground/        # Angular 20 + PrimeNG 20 (Fase 0)
├── index.html              # App principal (legacy)
├── ejemplo-tokens.css      # Ejemplo de fichero CSS para subir
├── styles/
│   ├── primeng-tokens.css  # Variables por defecto de PrimeNG (tema MDS base)
│   ├── components.css      # Estilos de componentes PrimeNG
│   └── app.css             # Layout y shell de la aplicación
├── js/
│   └── app.js              # Lógica: upload, tabs, inspector, dark mode
└── README.md
```

## 🚀 Cómo subir a GitHub Pages

### Paso 1 — Crear el repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Pon un nombre al repositorio, por ejemplo: `mds-playground`
3. Marca como **Public** (necesario para GitHub Pages gratis)
4. Haz clic en **Create repository**

### Paso 2 — Subir los ficheros

**Opción A — Desde la web de GitHub (sin instalar nada)**

1. En tu repositorio recién creado, haz clic en **"uploading an existing file"**
2. Arrastra TODOS los ficheros y carpetas del proyecto
3. Haz clic en **"Commit changes"**

**Opción B — Usando Git en terminal**

```bash
# Desde la carpeta del proyecto:
git init
git add .
git commit -m "feat: MDS Playground inicial"
git remote add origin https://github.com/TU-USUARIO/mds-playground.git
git push -u origin main
```

### Paso 3 — Activar GitHub Pages

1. En tu repositorio, ve a **Settings** (pestaña superior)
2. En el menú izquierdo, haz clic en **Pages**
3. En **Source**, selecciona `Deploy from a branch`
4. En **Branch**, selecciona `main` y la carpeta `/ (root)`
5. Haz clic en **Save**

### Paso 4 — Acceder al playground

En 1-2 minutos estará disponible en:

```
https://TU-USUARIO.github.io/mds-playground/
```

GitHub te lo muestra en la misma sección de **Settings → Pages**.

---

## 🎨 Cómo usar el playground

1. Abre el playground en el navegador
2. En el sidebar izquierdo, sube tu fichero `.css` con los tokens
3. Los componentes se actualizan **instantáneamente**
4. Usa las pestañas para navegar entre secciones
5. Alterna dark/light con el botón de la luna en el header

### Formato del CSS a subir

El fichero debe contener custom properties. Para **semántica** light/dark, usa los selectores `html[data-theme="light"]` y `html[data-theme="dark"]`. Para un ejemplo genérico en `:root`, ver `ejemplo-tokens.css`:

```css
:root {
  --p-primary-color:   #1d7162;
  --p-primary-50:      #e8f5f2;
  /* ... resto de tokens */
}
```

---

## 🔧 Personalización

Para añadir más componentes, edita `index.html` directamente.  
Para ajustar el tema por defecto, edita `styles/primeng-tokens.css`.

---

Playground de tokens · PrimeNG v17
