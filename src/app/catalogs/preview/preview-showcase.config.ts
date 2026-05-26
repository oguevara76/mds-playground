export interface PreviewScheduleItem {
  title: string;
  time: string;
  tone: 'teal' | 'green' | 'cyan';
  avatars?: string[];
}

export interface PreviewJobItem {
  title: string;
  company: string;
  type: string;
  salary: string;
  icon: string;
  logoClass?: string;
  isNew?: boolean;
}

export interface PreviewProductItem {
  name: string;
  image: string;
  price: string;
  rating: number;
}

export interface PreviewSaleRow {
  name: string;
  category: string;
  price: string;
  status: 'Stock' | 'LowStock';
}

export interface PreviewKpiItem {
  label: string;
  value: string;
  sub: string;
  sparkPath: string;
  sparkArea: string;
}

export const PREVIEW_SCHEDULE: PreviewScheduleItem[] = [
  {
    title: 'Design system meeting',
    time: '9 - 10 AM',
    tone: 'teal',
    avatars: [
      'https://picsum.photos/id/1005/32/32',
      'https://picsum.photos/id/1011/32/32',
      'https://picsum.photos/id/1012/32/32',
      'https://picsum.photos/id/1025/32/32',
    ],
  },
  { title: 'Lunch', time: '1 - 2 PM', tone: 'green' },
  {
    title: 'Design review',
    time: '3 - 4 PM',
    tone: 'cyan',
    avatars: ['https://picsum.photos/id/1005/32/32', 'https://picsum.photos/id/1025/32/32'],
  },
];

export const PREVIEW_JOBS: PreviewJobItem[] = [
  {
    title: 'Senior Software Engineer',
    company: 'Stripe',
    type: 'Full-time · Remote',
    salary: '$150k – $190k',
    icon: 'pi pi-code',
    logoClass: 'pv-job-logo-brand',
    isNew: true,
  },
  {
    title: 'Lead Product Designer',
    company: 'Airbnb',
    type: 'Full-time · Hybrid',
    salary: '$120k – $150k',
    icon: 'pi pi-palette',
  },
  {
    title: 'Senior Frontend Developer',
    company: 'Netflix',
    type: 'Part-time · On-site',
    salary: '$110k – $140k',
    icon: 'pi pi-desktop',
  },
];

export const PREVIEW_PRODUCTS: PreviewProductItem[] = [
  { name: 'Bamboo Watch', image: 'https://picsum.photos/id/28/60/60', price: '$65', rating: 5 },
  { name: 'Black Watch', image: 'https://picsum.photos/id/48/60/60', price: '$72', rating: 4 },
  { name: 'Blue Band', image: 'https://picsum.photos/id/119/60/60', price: '$79', rating: 3 },
  { name: 'Blue T-Shirt', image: 'https://picsum.photos/id/84/60/60', price: '$29', rating: 5 },
  { name: 'Bracelet', image: 'https://picsum.photos/id/106/60/60', price: '$15', rating: 4 },
];

export const PREVIEW_KPIS: PreviewKpiItem[] = [
  {
    label: 'Income',
    value: '$15,989',
    sub: '↓ $2,882 vs last period',
    sparkPath: 'M0,6 C15,8 30,14 50,18 C70,22 90,24 120,26',
    sparkArea:
      'M0,6 C15,8 30,14 50,18 C70,22 90,24 120,26 L120,42 L0,42 Z',
  },
  {
    label: 'Expenses',
    value: '$12,543',
    sub: '↑ $2,322 vs last period',
    sparkPath: 'M0,28 C20,25 40,20 60,16 C80,12 100,8 120,5',
    sparkArea:
      'M0,28 C20,25 40,20 60,16 C80,12 100,8 120,5 L120,42 L0,42 Z',
  },
  {
    label: 'Savings',
    value: '$5,210',
    sub: '↓ $5,011 vs last period',
    sparkPath: 'M0,10 C20,14 35,26 55,30 C75,26 95,16 120,8',
    sparkArea:
      'M0,10 C20,14 35,26 55,30 C75,26 95,16 120,8 L120,42 L0,42 Z',
  },
];

export const PREVIEW_SALES: PreviewSaleRow[] = [
  { name: 'Bamboo Watch', category: 'Accessories', price: '$65.00', status: 'Stock' },
  { name: 'Black Watch', category: 'Accessories', price: '$72.00', status: 'Stock' },
  { name: 'Blue Band', category: 'Fitness', price: '$79.00', status: 'LowStock' },
  { name: 'Blue T-Shirt', category: 'Clothing', price: '$29.00', status: 'Stock' },
  { name: 'Bracelet', category: 'Accessories', price: '$15.00', status: 'Stock' },
];

export const PREVIEW_MONTH_OPTIONS = [
  { label: 'MM', value: null },
  ...Array.from({ length: 12 }, (_, i) => {
    const mm = String(i + 1).padStart(2, '0');
    return { label: mm, value: mm };
  }),
];

export const PREVIEW_YEAR_OPTIONS = [
  { label: 'YYYY', value: null },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
  { label: '2028', value: '2028' },
];

/** Imagen del hero «Create budgets» (planificación / escritorio). */
export const PREVIEW_BUDGET_HERO_IMAGE =
  'https://picsum.photos/seed/budget-desk/520/360';

export const PREVIEW_EXPENSE_LEGEND = [
  { label: 'Transport', value: '$ 1,608', width: '16%', color: 'var(--p-primary-100)' },
  { label: 'Groceries', value: '$ 3,974', width: '40%', color: 'var(--p-primary-200)' },
  { label: 'Household', value: '$ 4,737', width: '47%', color: 'var(--p-primary-400)' },
  { label: 'Travel', value: '$ 4,600', width: '45%', color: 'var(--p-primary-600)' },
];
