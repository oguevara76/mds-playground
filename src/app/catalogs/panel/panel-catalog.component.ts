import { NgClass } from '@angular/common';
import { afterNextRender, Component, inject, Injector, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { Panel } from 'primeng/panel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import {
  Step,
  StepItem,
  StepList,
  StepPanel,
  StepPanels,
  Stepper,
} from 'primeng/stepper';
import { Toolbar } from 'primeng/toolbar';
import { ToggleButton } from 'primeng/togglebutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import {
  ACCORDION_CATALOG_PANELS,
  ACCORDION_CATALOG_STATE_DEMOS,
  ACCORDION_EXAMPLE_OPTIONS,
  ACCORDION_TEMPLATE_PANELS,
  CARD_EXAMPLE_OPTIONS,
  CARD_CATALOG_DEMO_HEIGHT,
  DIVIDER_ALIGN_OPTIONS,
  DIVIDER_BORDER_TYPE_OPTIONS,
  DIVIDER_STATE_DEMOS,
  PANEL_CATALOG_LINE_ITEMS,
  PANEL_CATALOG_DEMO_HEIGHT,
  PANEL_CATALOG_TAB_STATE_DEMOS,
  PANEL_CATALOG_TABS,
  PANEL_CATALOG_TEMPLATE_AVATAR_IMAGE,
  PANEL_CATALOG_TEMPLATE_BODY,
  PANEL_CATALOG_TEMPLATE_FOOTER,
  PANEL_CATALOG_TOTAL,
  PANEL_EXAMPLE_OPTIONS,
  STEPPER_CATALOG_BASIC_STEPS,
  STEPPER_CATALOG_DEMO_HEIGHT,
  STEPPER_CATALOG_STATE_DEMOS,
  STEPPER_CATALOG_TEMPLATE_INTERESTS,
  STEPPER_CATALOG_TEMPLATE_STEPS,
  STEPPER_CATALOG_TEMPLATE_SUCCESS_IMAGE,
  STEPPER_CATALOG_TEMPLATE_WIDTH,
  STEPPER_VARIANT_OPTIONS,
  TOOLBAR_CATALOG_DEMO_HEIGHT,
  TOOLBAR_CATALOG_EXAMPLE_DEMOS,
  TOOLBAR_CATALOG_NAV_ITEMS,
  type AccordionCatalogExampleKey,
  type AccordionCatalogStateKey,
  type AccordionInteractionState,
  type CardCatalogExampleKey,
  type CardInteractionState,
  type DividerInteractionState,
  type DividerStateDemo,
  type DividerStateKey,
  type PanelCatalogExampleKey,
  type PanelCatalogTabStateKey,
  type PanelInteractionState,
  type StepperCatalogStateKey,
  type StepperCatalogStepValue,
  type StepperCatalogTemplateInterest,
  type StepperInteractionState,
  type ToolbarCatalogExampleDemo,
  type ToolbarCatalogExampleKey,
} from './panel-catalog.config';

@Component({
  selector: 'app-panel-catalog',
  standalone: true,
  imports: [CatalogBlockHeadTitlePipe, CatalogInfoBlockComponent, CatalogPreviewFrameComponent, CatalogStateTagComponent, Accordion, AccordionPanel, AccordionHeader, AccordionContent, Avatar, Button, Card, IconField, InputIcon, InputText, Password, Tag, Tabs, TabList, Tab, TabPanels, TabPanel, ToggleButton, ToggleSwitch, FormsModule, NgClass, Divider, Select, Panel, Stepper, StepList, Step, StepPanels, StepPanel, StepItem, Toolbar],
  templateUrl: './panel-catalog.component.html',
  styleUrl: './panel-catalog.component.css',
  host: { class: 'panel-catalog-page' },
})
export class PanelCatalogComponent {
  private readonly injector = inject(Injector);

  // ─── Panel (p-panel) ───────────────────────────────────────────────────────

  readonly panelLineItems = PANEL_CATALOG_LINE_ITEMS;
  readonly panelTotal = PANEL_CATALOG_TOTAL;
  readonly panelTemplateBody = PANEL_CATALOG_TEMPLATE_BODY;
  readonly panelTemplateFooter = PANEL_CATALOG_TEMPLATE_FOOTER;
  readonly panelTemplateAvatar = PANEL_CATALOG_TEMPLATE_AVATAR_IMAGE;
  readonly panelExampleOptions = PANEL_EXAMPLE_OPTIONS;
  readonly panelDemoHeight = PANEL_CATALOG_DEMO_HEIGHT;

  readonly panelIx = signal<PanelInteractionState>({ example: 'basic' });
  readonly panelCollapsed = signal(false);

  setPanelExample(example: PanelCatalogExampleKey): void {
    this.panelIx.set({ example });
    this.panelCollapsed.set(false);
  }

  onPanelCollapsedChange(value: boolean | undefined): void {
    this.panelCollapsed.set(!!value);
  }

  trackPanelLineItem(_: number, item: { label: string }): string {
    return item.label;
  }

  // ─── Accordion ───────────────────────────────────────────────────────────────

  readonly accordionPanels = ACCORDION_CATALOG_PANELS;
  readonly accordionTemplatePanels = ACCORDION_TEMPLATE_PANELS;
  readonly accordionStateDemos = ACCORDION_CATALOG_STATE_DEMOS;
  readonly accordionExampleOptions = ACCORDION_EXAMPLE_OPTIONS;

  readonly accordionIx = signal<AccordionInteractionState>({ example: 'basic' });
  readonly accordionActive = signal<string | string[] | null>('0');

  setAccordionExample(example: AccordionCatalogExampleKey): void {
    this.accordionIx.set({ example });
    this.accordionActive.set(example === 'multiple' ? ['0'] : '0');
  }

  onAccordionChange(value: string | number | string[] | number[] | null | undefined): void {
    if (value === undefined || value === null) {
      return;
    }
    if (Array.isArray(value)) {
      this.accordionActive.set(value.map(String));
      return;
    }
    this.accordionActive.set(String(value));
  }

  trackAccordionPanel(_: number, panel: { value: string }): string {
    return panel.value;
  }

  trackAccordionTemplatePanel(_: number, panel: { value: string }): string {
    return panel.value;
  }

  trackAccordionState(_: number, demo: { key: AccordionCatalogStateKey }): AccordionCatalogStateKey {
    return demo.key;
  }

  // ─── Tabs ──────────────────────────────────────────────────────────────────

  readonly tabs = PANEL_CATALOG_TABS;
  readonly tabStateDemos = PANEL_CATALOG_TAB_STATE_DEMOS;

  readonly activeTab = signal('0');
  readonly showLeftIcon = signal(false);
  readonly showRightIcon = signal(false);

  iconVisibilityClass(): Record<string, boolean> {
    return {
      'show-left-icon': this.showLeftIcon(),
      'show-right-icon': this.showRightIcon(),
    };
  }

  setShowLeftIcon(value: boolean): void {
    this.showLeftIcon.set(value);
    this.scheduleTabsInkbarSync();
  }

  setShowRightIcon(value: boolean): void {
    this.showRightIcon.set(value);
    this.scheduleTabsInkbarSync();
  }

  trackTab(_: number, tab: { value: string }): string {
    return tab.value;
  }

  trackTabState(_: number, s: { key: PanelCatalogTabStateKey }): PanelCatalogTabStateKey {
    return s.key;
  }

  onTabChange(value: string | number | undefined): void {
    if (value === undefined || value === null) {
      return;
    }
    this.activeTab.set(String(value));
    this.scheduleTabsInkbarSync();
  }

  /** Paridad legacy: recoloca la barra activa tras cambiar iconos o pestaña. */
  private scheduleTabsInkbarSync(): void {
    afterNextRender(
      () => {
        const tablist = document.querySelector<HTMLElement>(
          '.tabs-catalog-live .p-tablist-tab-list',
        );
        if (!tablist) {
          return;
        }
        const inkbar = tablist.querySelector<HTMLElement>('.p-tablist-active-bar');
        const active = tablist.querySelector<HTMLElement>('.p-tab-active');
        if (!inkbar || !active) {
          return;
        }
        inkbar.style.width = `${active.offsetWidth}px`;
        inkbar.style.left = `${active.offsetLeft}px`;
      },
      { injector: this.injector },
    );
  }

  // ─── Divider ───────────────────────────────────────────────────────────────

  readonly dividerBorderTypeOptions = DIVIDER_BORDER_TYPE_OPTIONS;
  readonly dividerAlignOptions = DIVIDER_ALIGN_OPTIONS;
  readonly dividerStateDemos = DIVIDER_STATE_DEMOS;

  readonly dividerIx = signal<DividerInteractionState>({
    type: 'solid',
    align: 'center',
    showLabel: false,
  });

  patchDividerIx(patch: Partial<DividerInteractionState>): void {
    this.dividerIx.update((s) => ({ ...s, ...patch }));
  }

  trackDividerState(_: number, demo: DividerStateDemo): DividerStateKey {
    return demo.key;
  }

  // ─── Card ──────────────────────────────────────────────────────────────────

  readonly cardExampleOptions = CARD_EXAMPLE_OPTIONS;
  readonly cardDemoHeight = CARD_CATALOG_DEMO_HEIGHT;

  readonly cardIx = signal<CardInteractionState>({ example: 'basic' });

  cardFormEmail = '';
  cardFormPassword = '';

  setCardExample(example: CardCatalogExampleKey): void {
    this.cardIx.set({ example });
  }

  // ─── Stepper ───────────────────────────────────────────────────────────────

  readonly stepperBasicSteps = STEPPER_CATALOG_BASIC_STEPS;
  readonly stepperTemplateSteps = STEPPER_CATALOG_TEMPLATE_STEPS;
  readonly stepperTemplateInterests = STEPPER_CATALOG_TEMPLATE_INTERESTS;
  readonly stepperTemplateSuccessImage = STEPPER_CATALOG_TEMPLATE_SUCCESS_IMAGE;
  readonly stepperVariantOptions = STEPPER_VARIANT_OPTIONS;
  readonly stepperStateDemos = STEPPER_CATALOG_STATE_DEMOS;
  readonly stepperDemoHeight = STEPPER_CATALOG_DEMO_HEIGHT;
  readonly stepperTemplateWidth = STEPPER_CATALOG_TEMPLATE_WIDTH;

  readonly stepperIx = signal<StepperInteractionState>({ variant: 'horizontal', stepsOnly: false });
  readonly stepperActiveStep = signal<StepperCatalogStepValue>(1);

  stepperTemplateName = '';
  stepperTemplateEmail = '';
  stepperTemplatePassword = '';
  readonly stepperTemplateInterestValues = signal<Record<StepperCatalogTemplateInterest, boolean>>({
    Nature: false,
    Art: false,
    Music: false,
    Design: false,
    Photography: false,
    Movies: false,
    Sports: false,
    Gaming: false,
    Traveling: false,
    Dancing: false,
  });

  patchStepperIx(patch: Partial<StepperInteractionState>): void {
    this.stepperIx.update((s) => {
      const next = { ...s, ...patch };
      if (patch.variant && patch.variant !== s.variant) {
        this.stepperActiveStep.set(1);
        if (patch.variant === 'vertical') {
          next.stepsOnly = false;
        }
      }
      return next;
    });
  }

  onStepperValueChange(value: number | undefined): void {
    if (value === undefined || value === null) {
      return;
    }
    this.stepperActiveStep.set(value as StepperCatalogStepValue);
  }

  isStepperTemplateStepComplete(stepValue: number): boolean {
    return stepValue <= this.stepperActiveStep();
  }

  patchStepperTemplateInterest(label: StepperCatalogTemplateInterest, value: boolean): void {
    this.stepperTemplateInterestValues.update((current) => ({ ...current, [label]: value }));
  }

  trackStepperStep(_: number, step: { value: number }): number {
    return step.value;
  }

  trackStepperTemplateInterest(_: number, label: StepperCatalogTemplateInterest): string {
    return label;
  }

  trackStepperState(_: number, demo: { key: StepperCatalogStateKey }): StepperCatalogStateKey {
    return demo.key;
  }

  isStepperStepDisabled(_stepValue: number, demoKey: StepperCatalogStateKey): boolean {
    return demoKey === 'disabled';
  }

  isStepperStepActive(_stepValue: number, demoKey: StepperCatalogStateKey): boolean {
    return demoKey === 'active';
  }

  // ─── Toolbar ───────────────────────────────────────────────────────────────

  readonly toolbarExampleDemos = TOOLBAR_CATALOG_EXAMPLE_DEMOS;
  readonly toolbarNavItems = TOOLBAR_CATALOG_NAV_ITEMS;
  readonly toolbarDemoHeight = TOOLBAR_CATALOG_DEMO_HEIGHT;

  toolbarSearch = '';

  trackToolbarExample(_: number, demo: ToolbarCatalogExampleDemo): ToolbarCatalogExampleKey {
    return demo.key;
  }

  trackToolbarNavItem(_: number, item: { label: string }): string {
    return item.label;
  }
}
