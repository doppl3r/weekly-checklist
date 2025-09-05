export interface ChecklistItem {
  text: string;
  checked: boolean;
}

export interface Weekday {
  name: string;
  label: string;
  checklist: ChecklistItem[];
}

export interface Settings {
  language?: string;
}

export interface FormatNumberOptions extends Intl.NumberFormatOptions {}

export interface Duration {
  hours?: number;
  minutes?: number;
  seconds?: number;
  [key: string]: number | undefined;
}

export interface ModalAction {
  icon?: string;
  label: string;
  callback: () => void;
  animation?: string;
  [key: string]: any;
}

export interface ModalOptions {
  actions?: ModalAction[];
  title?: string;
  text?: string;
  image?: string;
}

export interface Storage {
  clear: () => Promise<void>;
  get: (keys?: string | string[]) => Promise<Record<string, any>>;
  getKeys: () => Promise<string[]>;
  remove: (keys: string | string[]) => Promise<void>;
  set: (items: Record<string, any>) => Promise<void>;
}

export type Weekdays = Record<string, Weekday>;
