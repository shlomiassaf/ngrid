import { PblColumn } from './columns/column';

export interface PblColumnSizeInfo {
  column: PblColumn;
  height: number;
  width: number;
  style: CSSStyleDeclaration;
  updateSize(): void;
}
