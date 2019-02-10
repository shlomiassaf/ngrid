import { PblTableColumnDef } from '../directives';
import { PblBaseColumnDefinition, PblColumnGroupDefinition } from './types';
import { PblMetaColumn } from './meta-column';
import { PblColumn } from './column';

const NEG_COLUMN_GROUP_MARK = Symbol('PblColumnGroup');
const CLONE_PROPERTIES: Array<keyof PblColumnGroup> = [];

function isPblColumnGroup(def: PblColumnGroupDefinition): def is PblColumnGroup {
  return def instanceof PblColumnGroup || def[NEG_COLUMN_GROUP_MARK] === true;
}

function getId(value: string | { id: string }): string {
  return typeof value === 'string' ? value : value.id;
}

export class PblColumnGroupStore {
  get all(): PblColumnGroup[] { return this._all; }

  private store = new Map<string, { group: PblColumnGroup; activeColumns: Set<string>; }>();
  private _all: PblColumnGroup[] = [];

  /**
   * Attach a column to a group.
   */
  attach(group: string | PblColumnGroup, column: string | PblColumn): boolean {
    const g = this._find(group);
    if (g) {
      g.activeColumns.add(getId(column));
      return true;
    }
    return false;
  }

  /**
   * Detach a column from a group.
   */
  detach(group: string | PblColumnGroup, column: string | PblColumn): boolean {
    const g = this._find(group);
    if (g) {
      return g.activeColumns.delete(getId(column));
    }
    return false;
  }

  /**
   * Returns a list of `PblColumnGroup` that does not have columns attached.
   */
  findGhosts(): PblColumnGroup[] {
    return Array.from(this.store.values())
      .filter( item => item.activeColumns.size === 0 )
      .map( item => item.group );
  }

  add(group: PblColumnGroup): void {
    this.store.set(group.id, { group, activeColumns: new Set<string>() });
    this.updateAll();
  }

  remove(group: string | PblColumnGroup): boolean {
    const g = this.find(group);
    if (g && this.store.delete(g.id)) {
      this.updateAll();
      return true;
    }
    return false;
  }

  find(group: string | PblColumnGroup): PblColumnGroup | undefined {
    const g = this._find(group);
    if (g) {
      return g.group;
    }
  }

  clone(): PblColumnGroupStore {
    const c = new PblColumnGroupStore();
    c.store = new Map<string, { group: PblColumnGroup; activeColumns: Set<string>; }>(this.store);
    c.updateAll();
    return c;
  }

  private _find(group: string | PblColumnGroup): { group: PblColumnGroup; activeColumns: Set<string>; } | undefined {
    return this.store.get(getId(group));
  }

  private updateAll(): void {
    this._all = Array.from(this.store.values()).map( item => item.group );
  }
}

export class PblColumnGroup extends PblMetaColumn implements PblColumnGroupDefinition {

  //#region PblColumnGroupDefinition
  /**
   * The table's column that is the first child column for this group.
   */
  prop: string;
  /**
   * The total span of the group (excluding the first child - i.e. prop).
   * The span and prop are used to get the child columns of this group.
   * The span is not dynamic, once the columns are set they don't change.
   *
   * For example, if a we have a span of 2 and the column at the 2nd position is hidden it will still count as
   * being spanned although the UI will span only 1 column... (because the 2nd is hidden...)
   */
  span: number;
  //#endregion PblColumnGroupDefinition

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
  columnDef: PblTableColumnDef<PblColumnGroup>;

  /**
   * When set, this column is a cloned column of an existing column caused by a split.
   * @internal
   */
  slaveOf?: PblColumnGroup;

  /** @internal */
  readonly columns: PblColumn[];

  constructor(def: PblColumnGroup | PblColumnGroupDefinition, columns: PblColumn[], public readonly placeholder = false) {
    super(isPblColumnGroup(def)
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

    for (const prop of CLONE_PROPERTIES) {
      if (prop in def) {
        this[prop as any] = def[prop]
      }
    }
  }

  static extendProperty(name: keyof PblColumnGroup): void {
    if (CLONE_PROPERTIES.indexOf(name) === -1) {
      CLONE_PROPERTIES.push(name);
    }
  }

  createSlave(columns: PblColumn[] = []): PblColumnGroup {
    const slave = new PblColumnGroup(this, columns);
    slave.id += '-slave' + Date.now();
    slave.slaveOf = this;
    slave.template = this.template;
    return slave;
  }

  replace(newColumn: PblColumn): boolean {
    const { id } = newColumn;
    const idx = this.columns.findIndex( c => c.id === id );
    if (idx > -1) {
      this.columns.splice(idx, 1, newColumn);
      return true;
    }
    return false;
  }
}
