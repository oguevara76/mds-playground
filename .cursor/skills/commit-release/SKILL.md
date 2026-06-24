---
name: commit-release
description: >-
  Genera texto de commit y notas de release GitHub para mds-playground con
  formato fijo del proyecto. Usar cuando el usuario pide texto para commit,
  mensaje de commit, release, notas de release, tag, versión, changelog o
  literatura para publicar en GitHub.
---

# Commit y release — mds-playground

Plantillas completas: [reference.md](reference.md).

## Antes de redactar

Ejecutar en paralelo (sin hacer commit salvo que lo pida):

```bash
git status -sb
git diff --stat HEAD
git tag -l --sort=-v:refname | head -5
git log $(git describe --tags --abbrev=0 2>/dev/null)..HEAD --oneline
```

Con eso determinar: alcance real, último tag y **versión siguiente**.

## Versión (tags `vMAJOR.MINOR.PATCH`)

| Cambio | Bump | Ejemplo |
|--------|------|---------|
| Nuevo showcase / feature visible | **minor** | v1.3.0 → **v1.4.0** |
| Correcciones, refactors, CI, docs | **patch** | v1.4.0 → v1.4.1 |
| Salto de convención / hito mayor acordado | **minor** desde x.2.x | v1.2.4 → v1.3.0 |

Indicar versión recomendada con una línea de justificación.

## Salida obligatoria (dos bloques)

Entregar **siempre** en este orden, en **español**:

1. **Mensaje de commit** (bloque ` ``` ` copiable)
2. **Release GitHub** — título + cuerpo markdown (bloque ` ```markdown ` copiable)

No crear commit ni release salvo petición explícita.

---

## 1. Mensaje de commit

Formato **Conventional Commits** alineado al repo:

```
<type>(<scope>): <título imperativo en minúsculas, ~72 chars>

< párrafo(s) en prosa: qué y por qué, no listado de archivos >
```

**Types habituales:** `feat`, `fix`, `refactor`, `docs`, `chore`, `ci`

**Scopes habituales:** catálogo (`form`, `overlay`, `button`, …), `core`, `ci`, o área tocada.

**Reglas:**
- Título: una línea, sin punto final.
- Cuerpo: 2–5 líneas; foco en valor para quien lee el historial.
- Opcional: versión corta de una sola línea si el usuario la pide aparte.

---

## 2. Release GitHub

**Título:** `vX.Y.Z — <tema principal en pocas palabras>`

**Cuerpo:** usar **exactamente** estas secciones (omitir vacías; no renombrar):

```markdown
## Resumen

<1–3 frases: qué entrega esta release y para quién>

## Nuevos componentes

### <Nombre> (`/<catálogo>#pg-<name>`)
- **Interaction:** …
- **CONFIGURAR:** … (si aplica)
- **States / Positions / Sizes:** … (si aplica)
- Puente de tokens … (si aplica)

## Correcciones posteriores (<ámbito>)

- …

## Otros cambios

- …

## Verificación

- [ ] …
```

### Reglas de contenido

- **Nuevos componentes:** una subsección `###` por componente; ruta con ancla `#pg-*`.
- **Correcciones posteriores:** iteraciones tras la implementación inicial o QA visual (no duplicar lo ya dicho en Nuevos componentes).
- **Otros cambios:** registry, index, scripts `regen:*`, CI, docs, reglas/skills.
- **Verificación:** checklist manual con rutas concretas (`/overlay#pg-drawer`, `/tokens`, etc.).
- Bullets con `-`; negritas solo para etiquetas de sección del showcase (**Interaction**, **CONFIGURAR**, …).
- No incluir secciones genéricas tipo "Test plan" ni tablas si no están en la plantilla.

---

## Idioma y tono

- Español en commit (cuerpo) y release.
- Prosa clara; evitar jerga vacía ("mejoras varias").
- No proponer `git push` ni crear tag salvo que lo pida.

## Ejemplo mínimo de referencia

Ver [reference.md](reference.md) — basado en v1.3.0 y v1.4.0 del repo.
