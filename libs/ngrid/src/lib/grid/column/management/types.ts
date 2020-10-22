import { IterableChanges } from '@angular/core';
import { PblMetaColumn, PblColumn, PblColumnGroup, PblColumnSet, PblMetaColumnDefinition, PblColumnGroupDefinition, COLUMN } from '../model';
import { GridRowType } from '../../row/types';

export interface PblMetaColumnStore {
  id: string;
  header?: PblMetaColumn;
  footer?: PblMetaColumn;
  headerGroup?: PblColumnGroup;
  footerGroup?: PblColumnGroup;
}

export interface PblColumnStoreMetaRow {
  rowDef: PblColumnSet<PblMetaColumnDefinition | PblColumnGroupDefinition>,
  keys: string[];
  isGroup?: boolean;
}

export type PblRowTypeToColumnTypeMap<T extends GridRowType> =
  T extends 'header' ? PblColumn
  : T extends 'data' ? PblColumn
  : T extends 'footer' ? PblColumn
  : T extends 'meta-header' ? PblMetaColumn | PblColumnGroup
  : T extends 'meta-footer' ? PblMetaColumn | PblColumnGroup
  : COLUMN;

export interface PblRowColumnsChangeEvent<TCol extends COLUMN> {
  columns: TCol[];
  changes: IterableChanges<TCol>;
}

export interface AutoSizeToFitOptions {
  /**
   * When `px` will force all columns width to be in fixed pixels
   * When `%` will force all column width to be in %
   * otherwise (default) the width will be set in the same format it was originally set.
   * e.g.: If width was `33%` the new width will also be in %, or if width not set the new width will not be set as well.
   *
   * Does not apply when columnBehavior is set and returns a value.
   */
  forceWidthType?: '%' | 'px';

  /**
   * When true will keep the `minWidth` column definition (when set), otherwise will clear it.
   * Does not apply when columnBehavior is set and returns a value.
   */
  keepMinWidth?: boolean;

  /**
   * When true will keep the `maxWidth` column definition (when set), otherwise will clear it.
   * Does not apply when columnBehavior is set and returns a value.
   */
  keepMaxWidth?: boolean

  /**
   * A function for per-column fine tuning of the process.
   * The function receives the `PblColumn`, its relative width (in %, 0 to 1) and total width (in pixels) and should return
   * an object describing how it should auto fit.
   *
   * When the function returns undefined the options are taken from the root.
   */
  columnBehavior?(column: PblColumn): Pick<AutoSizeToFitOptions, 'forceWidthType' | 'keepMinWidth' | 'keepMaxWidth'> | undefined;
}
