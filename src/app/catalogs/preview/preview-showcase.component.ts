import { Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Rating } from 'primeng/rating';
import { Select } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import {
  PREVIEW_BUDGET_HERO_IMAGE,
  PREVIEW_EXPENSE_LEGEND,
  PREVIEW_JOBS,
  PREVIEW_KPIS,
  PREVIEW_MONTH_OPTIONS,
  PREVIEW_PRODUCTS,
  PREVIEW_SALES,
  PREVIEW_SCHEDULE,
  PREVIEW_YEAR_OPTIONS,
  type PreviewSaleRow,
  type PreviewScheduleItem,
} from './preview-showcase.config';

@Component({
  selector: 'app-preview-showcase',
  standalone: true,
  imports: [
    Avatar,
    AvatarGroup,
    Button,
    Card,
    Checkbox,
    FormsModule,
    IconField,
    InputIcon,
    InputText,
    Rating,
    Select,
    TableModule,
    Tag,
  ],
  templateUrl: './preview-showcase.component.html',
  styleUrl: './preview-showcase.component.css',
  host: { class: 'preview-showcase-page' },
})
export class PreviewShowcaseComponent {
  readonly schedule = PREVIEW_SCHEDULE;
  readonly jobs = PREVIEW_JOBS;
  readonly products = PREVIEW_PRODUCTS;
  readonly kpis = PREVIEW_KPIS;
  readonly sales = PREVIEW_SALES;
  readonly monthOptions = PREVIEW_MONTH_OPTIONS;
  readonly yearOptions = PREVIEW_YEAR_OPTIONS;
  readonly expenseLegend = PREVIEW_EXPENSE_LEGEND;
  readonly budgetHeroImage = PREVIEW_BUDGET_HERO_IMAGE;

  readonly salesSearch = signal('');
  private readonly salesTable = viewChild<Table>('salesTable');
  readonly billingSame = signal(true);
  month: string | null = null;
  year: string | null = null;

  scheduleToneClass(item: PreviewScheduleItem): string {
    return `pv-schedule-item pv-sched-${item.tone}`;
  }

  saleStatusSeverity(row: PreviewSaleRow): 'success' | 'warn' {
    return row.status === 'Stock' ? 'success' : 'warn';
  }

  onSalesSearch(value: string): void {
    this.salesSearch.set(value);
    this.salesTable()?.filterGlobal(value, 'contains');
  }
}
