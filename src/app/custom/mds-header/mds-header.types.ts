export interface MdsHeaderTimezone {
  timezone: string;
  time: string;
  date: string;
  selected?: boolean;
}

export interface MdsHeaderBadge {
  value: string;
  severity: 'success' | 'info' | 'warn' | 'danger';
}

export type MdsHeaderTimezonePair = [MdsHeaderTimezone, MdsHeaderTimezone];
