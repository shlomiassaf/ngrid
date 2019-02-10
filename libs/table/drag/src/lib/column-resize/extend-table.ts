import { PblColumn } from '@pebula/table';

declare module '@pebula/table/lib/table/columns/column' {
  interface PblColumn {
    resize: boolean;
  }
}


declare module '@pebula/table/lib/table/columns/types' {
  interface PblColumnDefinition {
    resize?: boolean;
  }
}

PblColumn.extendProperty('resize');
