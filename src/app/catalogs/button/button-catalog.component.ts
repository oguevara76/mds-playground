import { NgClass, NgStyle } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { Divider } from 'primeng/divider';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import {
  BUTTON_BLOCKS,
  BUTTON_DEMO_STATES,
  BUTTON_DS_SEVERITIES,
  BUTTON_SEVERITY_SELECT_OPTIONS,
  BUTTON_TYPE_SELECT_OPTIONS,
  type ButtonCatalogType,
  BUTTON_SIZE_OPTIONS,
  BUTTON_SIZE_SELECT_OPTIONS,
  BUTTON_TEXT_VARIANT_SPECS,
  BUTTON_VARIANT_SPECS,
  type ButtonBlockConfig,
  type ButtonBlockKind,
  type ButtonDemoState,
  type ButtonDsSeverity,
  type ButtonInteractionSize,
  type ButtonVariantSpec,
} from './button-catalog.config';
import { buttonDemoWrapStyle } from './button-catalog.demo-styles';

export interface ButtonInteractionState {
  type: ButtonCatalogType;
  severity: ButtonDsSeverity;
  iconLeft: boolean;
  iconRight: boolean;
  rounded: boolean;
  raised: boolean;
  size: ButtonInteractionSize;
}

function defaultInteraction(): ButtonInteractionState {
  return {
    type: 'filled',
    severity: 'primary',
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
  imports: [Button, Divider, FormsModule, NgClass, NgStyle, Popover, PrimeTemplate, Select, SelectButton, ToggleSwitch],
  templateUrl: './button-catalog.component.html',
  styleUrl: './button-catalog.component.css',
})
export class ButtonCatalogComponent {
  readonly blocks = BUTTON_BLOCKS;
  readonly typeSelectOptions = BUTTON_TYPE_SELECT_OPTIONS;
  readonly severitySelectOptions = BUTTON_SEVERITY_SELECT_OPTIONS;
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

  activeSeverity(kind: ButtonBlockKind): ButtonDsSeverity {
    return this.ix(kind).severity;
  }

  severityLabel(kind: ButtonBlockKind): string {
    const value = this.activeSeverity(kind);
    return BUTTON_DS_SEVERITIES.find((s) => s.value === value)?.label ?? 'Primary';
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

  showRounded(block: ButtonBlockConfig): boolean {
    return block.showRounded !== false;
  }

  showRaised(block: ButtonBlockConfig): boolean {
    return block.showRaised !== false;
  }

  showType(block: ButtonBlockConfig): boolean {
    return block.showType !== false;
  }

  interactionOutlined(block: ButtonBlockConfig): boolean {
    if (block.kind === 'text') {
      return false;
    }
    return this.ix(block.kind).type === 'outlined';
  }

  interactionRounded(block: ButtonBlockConfig): boolean {
    return this.showRounded(block) && this.ix(block.kind).rounded;
  }

  variantRounded(block: ButtonBlockConfig, variant: ButtonVariantSpec): boolean {
    return this.showRounded(block) && !!variant.rounded;
  }

  interactionRaised(block: ButtonBlockConfig): boolean {
    return this.showRaised(block) && this.ix(block.kind).raised;
  }

  variantsFor(block: ButtonBlockConfig): ButtonVariantSpec[] {
    return block.kind === 'text' ? BUTTON_TEXT_VARIANT_SPECS : this.variantSpecs;
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
    return buttonDemoWrapStyle(variant, state, {
      text: kind === 'text',
      severity: this.activeSeverity(kind),
    });
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
