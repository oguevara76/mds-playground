# Referencia — commit y release

## Ejemplo: commit (v1.3.0)

```
feat(form): incorporar SelectButton y Password al catálogo Form

Añade showcases completos de SelectButton (Interaction, States, Sizes) y
Password (variantes Default/Float/Ifta, feedback con medidor progresivo y
listado de requisitos). Conecta tokens MDS en primeng-tokens.css, registra
ambos componentes en mds-component-registry y corrige el conteo único de
componentes en el buscador del playground.
```

## Ejemplo: release v1.3.0

**Título:** `v1.3.0 — SelectButton y Password en Form`

```markdown
## Resumen

Incorporación de **SelectButton** y **Password** al catálogo Form del playground MDS, con puente de tokens PrimeNG, registro en el component registry e iteraciones de corrección sobre Password tras la revisión visual.

## Nuevos componentes

### SelectButton (`/form#pg-selectbutton`)
- **Interaction:** popover CONFIGURAR con Item activo, selección múltiple y Size (sm / md / lg).
- **States:** Item 1, Item 3, Disabled e Invalid.
- **Sizes:** Small, Normal y Large.
- Puente de tokens `--p-selectbutton-*` (`border-radius`, `invalid-border-color`).

### Password (`/form#pg-password`)
- **Interaction:** variantes Default, Float Label e IftaLabel (mismo patrón que InputText).
- **CONFIGURAR:** Theme, Variant, Float variant, Size, Toggle mask, Feedback, Strength list, Show clear, Helper text.
- **States / Sizes:** respetan la variante activa; icono toggle mask dimensionado por tamaño.
- Puente de **14 tokens** `--p-password-*` (overlay, medidor, strength weak/medium/strong, icono).

## Correcciones posteriores (Password)

- **Sin placeholder** en ninguna sección del showcase (alineado con el componente real).
- **States:** valor enmascarado `********` en Fill e Invalid.
- **Feedback overlay:** estilos conectados a tokens MDS.
- **Strength list:** switch para mostrar/ocultar el listado de requisitos.
- **Medidor progresivo:** barra 25 % por regla cumplida con transición rojo → amarillo → verde.

## Otros cambios

- Registro en `mds-component-registry.json` de `password`, `selectbutton` y `togglebutton`.
- Contador del buscador: `PLAYGROUND_COMPONENT_COUNT` cuenta componentes únicos.

## Verificación

- [ ] `/form#pg-selectbutton` — Interaction, States y Sizes
- [ ] `/form#pg-password` — variantes Default / Float / Ifta
- [ ] Password con Feedback + Strength list
- [ ] Buscador del playground: conteo correcto
```

---

## Ejemplo: commit (v1.4.0)

```
feat(overlay): incorporar Drawer al catálogo Overlay

Añade showcase interactivo de p-drawer con botones por posición,
Full screen, popover CONFIGURAR (Modal) y vistas estáticas Positions.
Conecta tokens --drawer-* al puente --p-drawer-*, registra el componente
en mds-component-registry y alinea layout con tooltip-variant-block.
```

## Ejemplo: release v1.4.0

**Título:** `v1.4.0 — Drawer en Overlay`

```markdown
## Resumen

Incorporación de **Drawer** al catálogo Overlay del playground MDS, con PrimeNG `p-drawer` real, puente de tokens `--p-drawer-*`, registro en el component registry e iteraciones de ajuste de interacción y layout tras la revisión visual.

## Nuevos componentes

### Drawer (`/overlay#pg-drawer`)
- **Interaction:** botones primarios Left, Right, Top, Bottom y Full screen (icono a la derecha) para abrir el panel.
- **CONFIGURAR:** popover con opción Modal.
- **Positions:** diagramas estáticos por posición (contenedor + shape con tokens `--surface-context-*`).
- Puente de **8 tokens** `--p-drawer-*`.

## Correcciones posteriores (Drawer)

- Botones en **primary** con icono a la **derecha**.
- **Position** y **Full screen** fuera del popover; control por botones.
- Eliminados **Closable** del popover y link **Cerrar drawer activo**.
- Vistas Positions con `--surface-context-subtle` / `--surface-context-minimal`.
- Layout alineado con Tooltip (`drawer-variant-block`, `catalog-layout.css`).

## Otros cambios

- Registro en `mds-component-registry.json` e index del playground.
- Regeneración de `prime-runtime-bridge.generated.ts` y `primeng-tokens.css`.

## Verificación

- [ ] `/overlay#pg-drawer` — botones de posición y Full screen
- [ ] Popover CONFIGURAR — Modal
- [ ] Positions en light y dark
- [ ] Tokens `--drawer-*` en /tokens
```

---

## Release solo con fixes (sin componentes nuevos)

Omitir **## Nuevos componentes**. Ejemplo de título: `v1.4.1 — Correcciones Drawer y tokens`.

## Release refactor / CI

Omitir **Nuevos componentes** y **Correcciones posteriores** si no aplican; concentrar en **Resumen**, **Otros cambios** y **Verificación**.
