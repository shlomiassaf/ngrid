import { NegColumn } from '@pebula/table';

declare module '@pebula/table/lib/table/columns/column' {
  interface NegColumn {
    resize: boolean;
  }
}


declare module '@pebula/table/lib/table/columns/types' {
  interface NegColumnDefinition {
    resize?: boolean;
  }
}

NegColumn.extendProperty('resize');
