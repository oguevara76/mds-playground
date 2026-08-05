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

export type MdsHeaderVariant = 'default' | 'custom';

/** Par fijo local + UTC (cardinalidad acordada en implementación). */
export type MdsHeaderTimezonePair = [MdsHeaderTimezone, MdsHeaderTimezone];
