import { afterNextRender, DestroyRef, Injector, signal } from '@angular/core';

const BOOT_CLASS = 'catalog-section-booting';
/** Evita un parpadeo del loader en máquinas rápidas. */
const MIN_LOADER_MS = 160;

export interface CatalogSectionBoot {
  /** Montar el árbol pesado solo tras pintar el loader. */
  readonly contentMounted: ReturnType<typeof signal<boolean>>;
  /** Quitar el loader cuando el contenido ya ha pintado. */
  readonly ready: ReturnType<typeof signal<boolean>>;
}

/**
 * Arranque en dos fases para catálogos pesados:
 * 1) Solo loader (primer paint rápido).
 * 2) Monta contenido bajo el loader y lo revela tras el siguiente paint.
 */
export function createCatalogSectionBoot(
  injector: Injector,
  destroyRef?: DestroyRef,
): CatalogSectionBoot {
  const contentMounted = signal(false);
  const ready = signal(false);
  const shownAt = performance.now();

  const clearBootClass = (): void => {
    document.documentElement.classList.remove(BOOT_CLASS);
  };

  destroyRef?.onDestroy(clearBootClass);

  afterNextRender(
    () => {
      document.documentElement.classList.add(BOOT_CLASS);
      contentMounted.set(true);

      afterNextRender(
        () => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const elapsed = performance.now() - shownAt;
              const reveal = (): void => {
                clearBootClass();
                ready.set(true);
              };
              if (elapsed >= MIN_LOADER_MS) {
                reveal();
              } else {
                window.setTimeout(reveal, MIN_LOADER_MS - elapsed);
              }
            });
          });
        },
        { injector },
      );
    },
    { injector },
  );

  return { contentMounted, ready };
}
