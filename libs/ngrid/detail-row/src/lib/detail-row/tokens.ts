export interface PblDetailsRowToggleEvent<T = any> {
  row: T;
  expended: boolean;
  toggle(): void;
}

export const PLUGIN_KEY: 'detailRow' = 'detailRow';
