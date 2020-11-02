import { PblColumnGroupDefinition } from './types';
import { PblMetaColumn } from './meta-column';
import { PblColumn } from './column';

const PBL_NGRID_COLUMN_GROUP_MARK = Symbol('PblColumnGroup');
const CLONE_PROPERTIES: Array<keyof PblColumnGroup> = [];

export function isPblColumnGroup(def: any): def is PblColumnGroup {
  return def instanceof PblColumnGroup || (def && def[PBL_NGRID_COLUMN_GROUP_MARK] === true);
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

  columnIds: string[];
  //#endregion PblColumnGroupDefinition

  /**
   * Returns the visible state of the column.
   * The column is visible if AT LEAST ONE child column is visible (i.e. not hidden)
   */
  get isVisible(): boolean {
    return this.columns.some( c => !c.hidden );
  }

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
      : { id: `group-${def.columnIds.join('.')}-row-${def.rowIndex}`, kind: 'header' as 'header', ...(def as any) }
    );
    this[PBL_NGRID_COLUMN_GROUP_MARK] = true;
    this.columnIds = def.columnIds;
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
    const slave = new PblColumnGroup({...this, id: this.id + '-slave' + Date.now()}, columns);
    slave.slaveOf = this;
    Object.defineProperty(slave, 'template', { get: function() { return this.slaveOf.template; }, set: function(value) {} } );
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
