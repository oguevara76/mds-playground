/** Avatar / AvatarGroup: fuerza tokens MDS sobre estilos runtime de PrimeNG Aura. */
export const MDS_AVATAR_OVERRIDE_STYLE_ID = 'mds-avatar-overrides';

export const AVATAR_MDS_OVERRIDE_CSS = `
.p-avatar {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  width: var(--p-avatar-width, var(--avatar-width, 28px)) !important;
  height: var(--p-avatar-height, var(--avatar-height, 28px)) !important;
  min-width: var(--p-avatar-width, var(--avatar-width, 28px)) !important;
  min-height: var(--p-avatar-height, var(--avatar-height, 28px)) !important;
  max-width: var(--p-avatar-width, var(--avatar-width, 28px)) !important;
  max-height: var(--p-avatar-height, var(--avatar-height, 28px)) !important;
  font-size: var(--p-avatar-font-size, var(--avatar-font-size, 14px)) !important;
  background: var(--p-avatar-background, var(--avatar-background)) !important;
  color: var(--p-avatar-color, var(--avatar-color)) !important;
  border-radius: var(--avatar-border-radius, var(--content-border-radius, 6px)) !important;
  font-family: var(--p-font-family) !important;
}

.p-avatar:not(.p-avatar-circle),
.p-avatar-lg:not(.p-avatar-circle),
.p-avatar-xl:not(.p-avatar-circle) {
  border-radius: var(--avatar-border-radius, var(--content-border-radius, 6px)) !important;
}

.p-avatar.p-avatar-circle,
.p-avatar-lg.p-avatar-circle,
.p-avatar-xl.p-avatar-circle {
  border-radius: 50% !important;
}

.p-avatar.p-avatar-image {
  background: transparent !important;
  padding: 0 !important;
  position: relative !important;
}

.p-avatar .p-avatar-icon {
  font-size: var(--p-avatar-icon-size, var(--avatar-icon-size, 14px)) !important;
  line-height: 1 !important;
}

.p-avatar-label {
  line-height: 1 !important;
}

.p-avatar img {
  display: block !important;
  border-radius: 0 !important;
  object-fit: cover !important;
}

.p-avatar.p-avatar-image img {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
}

.p-avatar-lg {
  width: var(--p-avatar-lg-width, var(--avatar-lg-width, 42px)) !important;
  height: var(--p-avatar-lg-height, var(--avatar-lg-height, 42px)) !important;
  min-width: var(--p-avatar-lg-width, var(--avatar-lg-width, 42px)) !important;
  min-height: var(--p-avatar-lg-height, var(--avatar-lg-height, 42px)) !important;
  max-width: var(--p-avatar-lg-width, var(--avatar-lg-width, 42px)) !important;
  max-height: var(--p-avatar-lg-height, var(--avatar-lg-height, 42px)) !important;
  font-size: var(--p-avatar-lg-font-size, var(--avatar-lg-font-size, 20px)) !important;
}

.p-avatar-lg .p-avatar-icon {
  font-size: var(--p-avatar-lg-icon-size, var(--avatar-lg-icon-size, 20px)) !important;
}

.p-avatar-xl {
  width: var(--p-avatar-xl-width, var(--avatar-xl-width, 56px)) !important;
  height: var(--p-avatar-xl-height, var(--avatar-xl-height, 56px)) !important;
  min-width: var(--p-avatar-xl-width, var(--avatar-xl-width, 56px)) !important;
  min-height: var(--p-avatar-xl-height, var(--avatar-xl-height, 56px)) !important;
  max-width: var(--p-avatar-xl-width, var(--avatar-xl-width, 56px)) !important;
  max-height: var(--p-avatar-xl-height, var(--avatar-xl-height, 56px)) !important;
  font-size: var(--p-avatar-xl-font-size, var(--avatar-xl-font-size, 28px)) !important;
}

.p-avatar-xl .p-avatar-icon {
  font-size: var(--p-avatar-xl-icon-size, var(--avatar-xl-icon-size, 28px)) !important;
}

.p-avatar-group {
  display: inline-flex !important;
  align-items: center !important;
  width: fit-content !important;
  max-width: 100% !important;
  isolation: isolate !important;
}

.p-avatar-group .p-avatar,
.p-avatar-group > p-avatar {
  position: relative !important;
  border: 2px solid var(--p-avatar-group-border-color, var(--avatar-group-border-color)) !important;
}

/* Apilamiento: izquierda al fondo (layer-1), derecha delante (layer-N). */
.p-avatar-group .avatar-group-layer-1,
.p-avatar-group > .avatar-group-layer-1 { z-index: 1 !important; }
.p-avatar-group .avatar-group-layer-2,
.p-avatar-group > .avatar-group-layer-2 { z-index: 2 !important; }
.p-avatar-group .avatar-group-layer-3,
.p-avatar-group > .avatar-group-layer-3 { z-index: 3 !important; }
.p-avatar-group .avatar-group-layer-4,
.p-avatar-group > .avatar-group-layer-4 { z-index: 4 !important; }
.p-avatar-group .avatar-group-layer-5,
.p-avatar-group > .avatar-group-layer-5 { z-index: 5 !important; }
.p-avatar-group .avatar-group-layer-6,
.p-avatar-group > .avatar-group-layer-6 { z-index: 6 !important; }

.p-avatar-group .p-avatar.avatar-group-overflow {
  background: var(
    --avatar-group-overflow-background,
    var(--surface-context-subtle, var(--p-surface-200))
  ) !important;
  color: var(
    --avatar-group-overflow-color,
    var(--surface-context-muted, var(--p-surface-500))
  ) !important;
  font-weight: 600 !important;
}

.p-avatar-group .p-avatar.avatar-group-overflow:not(.p-avatar-lg):not(.p-avatar-xl) {
  font-size: 11px !important;
}

.p-avatar-group .p-avatar-lg.avatar-group-overflow {
  font-size: 14px !important;
}

.p-avatar-group .p-avatar-xl.avatar-group-overflow {
  font-size: 18px !important;
}

.p-avatar-group .p-avatar + .p-avatar {
  margin-inline-start: var(--p-avatar-group-offset, var(--avatar-group-offset, -12px)) !important;
}

.p-avatar-group .p-avatar-lg + .p-avatar-lg {
  margin-inline-start: var(--p-avatar-lg-group-offset, var(--avatar-lg-group-offset, -14px)) !important;
}

.p-avatar-group .p-avatar-xl + .p-avatar-xl {
  margin-inline-start: var(--p-avatar-xl-group-offset, var(--avatar-xl-group-offset, -20px)) !important;
}
`;
