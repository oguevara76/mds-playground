# Pasos guiados — add-playground-component

Plantillas para `AskQuestion`. Siempre incluir opción implícita **Other** (texto libre).

---

## Paso 0/7 — Identificar componente

Mostrar: `Paso 0/7`

**Si el usuario no nombró componente:**

- **Prompt:** ¿Qué componente PrimeNG quieres incorporar?
- **Opciones:** Other (escribe el nombre, ej. `select`, `datepicker`)

**Si ya lo nombró:**

- **Prompt:** ¿Confirmas incorporar `{name}`?
- **Opciones:**
  - Sí, incorporar `{name}`
  - No, otro componente → Other

**Tras respuesta:**

```bash
pnpm run mds:component-session -- init --component {name}
pnpm run mds:component-session -- set-step --step 1
```

---

## Paso 1/7 — Análisis

Mostrar: `Paso 1/7` + resumen acordado.

**Ejecutar sin preguntar:**

```bash
pnpm run mds:component-analyze -- --component {name}
```

Presentar informe resumido (showcase sí/no, vars, popover propuesto).

**AskQuestion — catálogo:**

- **Prompt:** ¿En qué catálogo debe vivir `{name}`?
- **Opciones:** Form (recomendado si aplica) / Misc / Overlay / Panel / Data / Messages / Menu / Button / Other

**AskQuestion — referencia:**

- **Prompt:** ¿Componente de referencia para copiar estructura?
- **Opciones:** `{reference_suggested}` / `{reference_alternative}` / Other

**Persistir:**

```bash
pnpm run mds:component-session -- patch --json '{"catalog":"form","reference":"inputtext","step":2}' --note "paso1"
```

---

## Paso 2/7 — Popover CONFIGURAR

Mostrar: `Paso 2/7` + tabla de propiedades (ver salida analyze).

**AskQuestion — propiedades:**

- **Prompt:** ¿Cómo confirmar las propiedades del popover?
- **Opciones:**
  - A) Aprobar tabla tal cual
  - B) Aprobar pero quitar algunas → Other (listar cuáles)
  - C) Aprobar pero añadir propiedades → Other (listar cuáles)
  - D) Rehacer tabla → Other (especificar)

**AskQuestion — hint:**

- **Prompt:** Texto del hint bajo CONFIGURAR
- **Opciones:** Usar autogenerado (`{popover_hint}`) / Other

**Persistir:** `popover.confirmed = true`, `popover.props`, `popover.hint`, `step = 3`.

**No escribir HTML hasta Paso 5.**

---

## Paso 3/7 — Variables CSS

Mostrar: `Paso 3/7` + tabla por categoría (`ok`, `new_in_core`, `missing_in_core`, `new_figma`, …).

**AskQuestion — estrategia:**

- **Prompt:** ¿Cómo gestionar variables no-ok?
- **Opciones:**
  - A) Decidir una a una
  - B) Acción masiva por categoría
  - C) Dejar todas como pendientes en log
  - D) Redirigir a update-mds-core (tengo export Figma)
  - Other

### Modo A (lotes de 5)

Por variable:

- **Prompt:** Acción para `{var}` ({categoría})
- **Opciones:** Crear en core / Conectar puente / Ambas / Pendiente en log / Omitir / Other

Ejecutar acciones aprobadas. Pendiente:

```bash
pnpm run mds:component-pending -- add --component {name} --var {var} --category {cat}
```

### Modo B

Por categoría (ej. `new_in_core`):

- Crear todas en core
- Conectar todas al puente
- Ambas
- Todas a pendientes
- Other

**Persistir:** `variables.actions[]`, `step = 4`.

---

## Paso 4/7 — Alcance implementación

Mostrar: `Paso 4/7` + checklist:

- Componente + catálogo + referencia
- Popover final
- Vars conectadas / pendientes
- Lista de ficheros

**AskQuestion:**

- **Prompt:** ¿Proceder con la implementación?
- **Opciones:**
  - Sí, implementar ahora
  - Ajustar alcance → Other (ej. sin Variants & States)
  - Cancelar (guardar sesión)

**Persistir:** `implementation.approved = true`, `step = 5`.

---

## Paso 5/7 — Implementación

Mostrar progreso con checklist de ficheros. No preguntar salvo error bloqueante.

Al terminar → Paso 6 automático.

---

## Paso 6/7 — QA

```bash
pnpm run mds:component-qa -- --component {name}
pnpm run build
```

**AskQuestion (solo si FAIL o usuario quiere revisar):**

- **Prompt:** Resultado QA
- **Opciones:**
  - PASS — continuar al cierre
  - FAIL — corregir automáticamente
  - FAIL — indicar qué revisar → Other

**Si PASS:** entregar **inmediatamente** Paso 7 en la misma respuesta.

---

## Paso 7/7 — Confirmación (sin pregunta)

**No usar `AskQuestion`.**

Entregar bloque único:

1. Título: **Confirmación — incorporación completada**
2. Incorporación de `{Name}` + QA PASS
3. Resumen técnico (ruta, popover, vars, pendientes)
4. Mensaje al gestor (plantilla en SKILL.md)
5. Ruta a `scripts/mds-component-pending.json` si hay pendientes

```bash
pnpm run mds:component-session -- patch --json '{"qa":{"status":"done"},"step":7}' --note "completado"
```

**Fin del wizard.**

---

## Retomar sesión

```bash
pnpm run mds:component-session -- get
```

**AskQuestion:**

- Continuar desde Paso N
- Empezar de cero (mismo componente)
- Cambiar componente → Other
