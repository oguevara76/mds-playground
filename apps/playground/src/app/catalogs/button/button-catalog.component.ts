import { NgClass, NgStyle } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { Divider } from 'primeng/divider';
import { SelectButton } from 'primeng/selectbutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import {
  BUTTON_BLOCKS,
  BUTTON_DEMO_STATES,
  BUTTON_DS_SEVERITIES,
  BUTTON_SIZE_OPTIONS,
  BUTTON_SIZE_SELECT_OPTIONS,
  BUTTON_VARIANT_SPECS,
  type ButtonBlockKind,
  type ButtonDemoState,
  type ButtonInteractionSize,
  type ButtonSeverity,
  type ButtonVariantSpec,
} from './button-catalog.config';
import { buttonDemoWrapStyle } from './button-catalog.demo-styles';

export interface ButtonInteractionState {
  iconLeft: boolean;
  iconRight: boolean;
  rounded: boolean;
  raised: boolean;
  size: ButtonInteractionSize;
}

function defaultInteraction(): ButtonInteractionState {
  return {
    iconLeft: false,
    iconRight: false,
    rounded: false,
    raised: false,
    size: 'normal',
  };
}

@Component({
  selector: 'app-button-catalog',
  standalone: true,
  imports: [Button, Divider, FormsModule, NgClass, NgStyle, Popover, PrimeTemplate, SelectButton, ToggleSwitch],
  templateUrl: './button-catalog.component.html',
  styleUrl: './button-catalog.component.css',
})
export class ButtonCatalogComponent {
  readonly blocks = BUTTON_BLOCKS;
  readonly dsSeverities = BUTTON_DS_SEVERITIES;
  readonly variantSpecs = BUTTON_VARIANT_SPECS;
  readonly demoStates = BUTTON_DEMO_STATES;
  readonly sizeOptions = BUTTON_SIZE_OPTIONS;
  readonly sizeSelectOptions = BUTTON_SIZE_SELECT_OPTIONS;

  private readonly interactionByKind = signal<Record<ButtonBlockKind, ButtonInteractionState>>({
    standard: defaultInteraction(),
    icon: defaultInteraction(),
    text: defaultInteraction(),
  });

  ix(kind: ButtonBlockKind): ButtonInteractionState {
    return this.interactionByKind()[kind];
  }

  patchIx(kind: ButtonBlockKind, patch: Partial<ButtonInteractionState>): void {
    this.interactionByKind.update((all) => ({
      ...all,
      [kind]: { ...all[kind], ...patch },
    }));
  }

  interactionDualIcons(kind: ButtonBlockKind): boolean {
    if (kind === 'icon') {
      return false;
    }
    const state = this.ix(kind);
    return state.iconLeft && state.iconRight;
  }

  interactionIcon(kind: ButtonBlockKind): string | undefined {
    const ix = this.ix(kind);
    if (kind === 'icon') {
      return 'pi pi-plus';
    }
    if (this.interactionDualIcons(kind)) {
      return undefined;
    }
    if (ix.iconLeft || ix.iconRight) {
      return 'pi pi-check';
    }
    return undefined;
  }

  interactionIconPos(kind: ButtonBlockKind): 'left' | 'right' {
    const ix = this.ix(kind);
    if (kind === 'icon' || ix.iconLeft) {
      return 'left';
    }
    return 'right';
  }

  isTextBlock(kind: ButtonBlockKind): boolean {
    return kind === 'text';
  }

  /** PrimeNG `size`: omitir en Normal. */
  interactionPrimeSize(kind: ButtonBlockKind): 'small' | 'large' | undefined {
    const size = this.ix(kind).size;
    return size === 'normal' ? undefined : size;
  }

  demoWrapStyle(
    variant: ButtonVariantSpec,
    state: ButtonDemoState,
    kind: ButtonBlockKind,
  ): Record<string, string> | null {
    return buttonDemoWrapStyle(variant, state, kind === 'text');
  }

  demoStateClass(state: ButtonDemoState): string {
    if (state === 'default') {
      return '';
    }
    return `p-button-demo-wrap p-button-demo--${state}`;
  }

  variantRowLabel(variant: ButtonVariantSpec): string {
    return variant.label;
  }
}
