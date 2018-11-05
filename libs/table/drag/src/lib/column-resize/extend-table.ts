import { NegColumn } from '@neg/table';

declare module '@neg/table/lib/table/columns/column' {
  interface NegColumn {
    resize: boolean;
  }
}


declare module '@neg/table/lib/table/columns/types' {
  interface NegColumnDefinition {
    resize?: boolean;
  }
}

NegColumn.extendProperty('resize');
