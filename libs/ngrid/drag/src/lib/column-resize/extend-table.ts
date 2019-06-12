import { PblColumn } from '@pebula/ngrid';

declare module '@pebula/ngrid/lib/table/columns/column' {
  interface PblColumn {
    resize: boolean;
  }
}


declare module '@pebula/ngrid/lib/table/columns/types' {
  interface PblColumnDefinition {
    resize?: boolean;
  }
}

// We trick the tree-shaker with an IIFE so it will not remove the function call expression
PblColumn.prototype.updateWidth = (function() {
  PblColumn.extendProperty('resize');
  return PblColumn.prototype.updateWidth;
})();
