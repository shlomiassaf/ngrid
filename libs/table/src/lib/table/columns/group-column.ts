import { NegTableColumnDef } from '../directives';
import { NegColumnGroupDefinition } from './types';
import { NegMetaColumn } from './meta-column';
import { NegColumn } from './column';

const NEG_COLUMN_GROUP_MARK = Symbol('NegColumnGroup');

function isNegColumnGroup(def: NegColumnGroupDefinition): def is NegColumnGroup {
  return def instanceof NegColumnGroup || def[NEG_COLUMN_GROUP_MARK] === true;
}

export class NegColumnGroup extends NegMetaColumn implements NegColumnGroupDefinition {

  //#region NegColumnGroupDefinition
  prop: string;
  span: number;
  //#endregion NegColumnGroupDefinition

  /**
   * Returns the visible state of the column.
   * The column is visible if AT LEAST ONE child column is visible (i.e. not hidden)
   */
  get isVisible(): boolean {
    return this.columns.some( c => !c.hidden );
  }
    /**
   * The column def for this column.
   */
  columnDef: NegTableColumnDef<NegColumnGroup>;

  /** @internal */
  readonly columns: NegColumn[];

  constructor(def: NegColumnGroup | NegColumnGroupDefinition, columns: NegColumn[], public readonly placeholder = false) {
    super(isNegColumnGroup(def)
      ? def
      : { id: `group-${def.prop}-span-${def.span}-row-${def.rowIndex}`, kind: 'header' as 'header', ...(def as any) }
    );

    this[NEG_COLUMN_GROUP_MARK] = true;
    this.prop = def.prop;
    this.span = def.span;
    this.columns = columns;
    for (const c of columns) {
      c.markInGroup(this);
    }
  }
}
