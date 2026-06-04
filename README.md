# MDS Playground

Playground **Angular 20 + PrimeNG 20** para previsualizar componentes con tokens MDS, upload de CSS y catálogo de tokens.

El playground HTML estático (legacy) está archivado en `backups/playground-static-*.zip` para consulta o restauración local.

## Desarrollo local

```bash
cd ~/Desktop/Github/mds-playground
pnpm install
pnpm start
```

Abre en el navegador: http://localhost:3000/button

| Documento | Contenido |
|-----------|-----------|
| [docs/FASE-0.md](docs/FASE-0.md) | Upload, `ejemplos/`, pruebas |
| [docs/TEMA-ANGULAR.md](docs/TEMA-ANGULAR.md) | Cascada MDS + puente PrimeNG |
| [docs/GITHUB-PAGES.md](docs/GITHUB-PAGES.md) | Build y publicación en Pages |

## Estructura

```
mds-playground/
├── src/                 # App Angular
├── ejemplos/            # Marcas de ejemplo (local, no en git — ver regen:ejemplos)
├── styles/              # Core MDS + shell
├── scripts/             # Regeneración de tokens y ejemplos
├── docs/
└── backups/             # ZIP locales (ignorado por git)
```

## Scripts útiles

```bash
pnpm run regen:mds       # Catálogo tokens + puente PrimeNG
pnpm run regen:ejemplos  # Sincronizar ejemplos/ desde core
pnpm run build:pages     # Build para GitHub Pages
pnpm run backup          # Punto de control ZIP del repo
```
