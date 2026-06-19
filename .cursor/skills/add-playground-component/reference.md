# Referencia — incorporar componente

## Mapa PrimeNG → catálogo

| Tipo | Catálogo | Referencia | Popover típico |
|------|----------|------------|----------------|
| Button-like | button | button | Type, Variant, Size, flags |
| Form choice | form | checkbox, toggleswitch | Theme, Size |
| Text input | form | inputtext | Variant, Theme, Size, Float |
| Select / picker | form | inputtext, select | Theme, Size, variant |
| Severity chip | misc | tag, badge | Severity, Size |
| Overlay | overlay | tooltip | Position, Theme |
| Panel | panel | tabs, divider | Tab state, layout |
| Data | data | paginator | Layout, size |
| Messages | messages | message, toast | Severity, Size |

## Estructura HTML obligatoria

```html
<section
  class="preview-section preview-section--flush catalog-block-section"
  id="pg-{name}"
  tabindex="-1"
>
  <header class="catalog-block-head">
    <h3 class="section-title component-title-primary">{Title}</h3>
  </header>
  <div class="catalog-block-body">
    <div class="btn-section catalog-interaction-section">
      <p class="btn-section-title">Interaction</p>
      <div class="input-interaction-row catalog-interaction-row--center">
        <div class="catalog-showcase-interactive">
          <!-- p-{component} demo -->
        </div>
        <aside class="button-config-aside">
          <button
            type="button"
            class="button-config-aside-title button-config-link"
            (click)="configPopover.toggle($event)"
            aria-haspopup="dialog"
            [attr.aria-expanded]="configPopover.overlayVisible"
          >
            CONFIGURAR
          </button>
          <p class="button-config-aside-hint">{hint}</p>
          <p-popover
            #configPopover
            styleClass="button-config-popover"
            appendTo="body"
            [ariaLabel]="'Configurar {Title}'"
          >
            <div class="button-config-popover-body button-config-switches">
              <!-- p-select | p-selectbutton | p-toggleswitch -->
            </div>
          </p-popover>
        </aside>
      </div>
    </div>
    <!-- Variants & States -->
    <!-- Sizes (si aplica) -->
  </div>
</section>
```

Estilos compartidos: `src/styles/catalog-layout.css`.

## Patrón TypeScript (config)

```typescript
// *-catalog.config.ts
export interface {Name}InteractionState {
  size: FormInteractionSize;
  // … props del popover acordadas
}

export const {NAME}_SIZE_OPTIONS = FORM_SIZE_SELECT_OPTIONS; // reutilizar si aplica
```

```typescript
// *-catalog.component.ts
readonly {name}Ix = signal<{Name}InteractionState>({ … });

patch{Name}Ix(patch: Partial<{Name}InteractionState>): void {
  this.{name}Ix.update((s) => ({ ...s, ...patch }));
}
```

## Registro transversal

**playground-component-index.ts:**

- Añadir `pg-{name}` en `TOKEN_PREFIXES`
- Entrada en `buildIndex()`

**mds-component-registry.json:**

```json
"{name}": {
  "playground_anchor": "pg-{name}",
  "primeng_prefix": "{prefix}",
  "watch_vars": ["--{prefix}-*", "--p-{prefix}-*"]
}
```

## Tokens

1. Vars en `styles/mds-components.css` (`--{prefix}-*`)
2. Puente en `styles/primeng-tokens.css` (`--p-{prefix}-*`)
3. `pnpm run regen:mds`
4. Si PrimeNG ignora tokens: `{name}-mds-overrides.ts` + `primeng-{name}-parity.css`

## Checklist implementación

- [ ] Bloque en catálogo (config + component + html)
- [ ] Ancla `pg-{name}`
- [ ] Popover CONFIGURAR funcional
- [ ] Variants & States + Sizes
- [ ] Index + registry
- [ ] Vars conectadas o en pending log
- [ ] `regen:mds` si hubo bridge
- [ ] QA + build PASS
