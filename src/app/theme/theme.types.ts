import type { UploadSlot } from './css-import-normalize';

export interface LoadedSlotFile {
  fileName: string;
}

export type LoadedSlotsMap = Partial<Record<UploadSlot, LoadedSlotFile>>;
