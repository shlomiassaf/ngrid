import { PblColumn } from '@pebula/ngrid';

declare module '@pebula/ngrid/lib/grid/column/model/column' {
  interface PblColumn {
    resize: boolean;
  }
}


declare module '@pebula/ngrid/lib/grid/column/model/types' {
  interface PblColumnDefinition {
    resize?: boolean;
  }
}

export function colResizeExtendGrid(): void {
  PblColumn.extendProperty('resize');
}
