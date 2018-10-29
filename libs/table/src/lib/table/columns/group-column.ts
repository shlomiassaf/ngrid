import { SgColumnGroupDefinition } from './types';
import { SgMetaColumn } from './meta-column';
import { SgColumn } from './column';

const SG_COLUMN_GROUP_MARK = Symbol('SgColumnGroup');

function isSgColumnGroup(def: SgColumnGroupDefinition): def is SgColumnGroup {
  return def instanceof SgColumnGroup || def[SG_COLUMN_GROUP_MARK] === true;
}

export class SgColumnGroup extends SgMetaColumn implements SgColumnGroupDefinition {

  //#region SgColumnGroupDefinition
  prop: string;
  span: number;
  //#endregion SgColumnGroupDefinition

  /**
   * Returns the visible state of the column.
   * The column is visible if AT LEAST ONE child column is visible (i.e. not hidden)
   */
  get isVisible(): boolean {
    return this.columns.some( c => !c.hidden );
  }

  /** @internal */
  orgWidth?: string;
  /** @internal */
  readonly columns: SgColumn[];

  constructor(def: SgColumnGroup | SgColumnGroupDefinition, columns: SgColumn[], public readonly placeholder = false) {
    super(isSgColumnGroup(def)
      ? def
      : { id: `group-${def.prop}-span-${def.span}-row-${def.rowIndex}`, kind: 'header' as 'header', ...(def as any) }
    );

    this[SG_COLUMN_GROUP_MARK] = true;
    if (isSgColumnGroup(def)) {
      this.orgWidth = def.orgWidth;
    } else {
      if (this.width) {
        this.orgWidth = this.width;
      }
    }
    this.prop = def.prop;
    this.span = def.span;
    this.columns = columns;
    for (const c of columns) {
      c.markInGroup(this);
    }
  }
}
