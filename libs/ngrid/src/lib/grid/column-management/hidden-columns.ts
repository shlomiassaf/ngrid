import { PblColumn } from '../columns/column';

export class HiddenColumns {
  readonly hidden = new Set<string>();
  readonly allHidden = new Set<string>();
  private readonly indirect = new Map<string, Set<string>>();

  constructor() {
    this.clear(false);
  }

  add(columns: PblColumn[] | string[], indirect?: string) {
    let collection: Set<string>;
    if (indirect) {
      collection = this.indirect.get(indirect);
      if (!collection) {
        this.indirect.set(indirect, collection = new Set<string>());
      }
    } else {
      collection = this.hidden;
    }
    const size = collection.size;
    if (columns[0] instanceof PblColumn) {
      for(const c of columns as PblColumn[]) {
        collection.add(c.id);
      }
    } else {
      for(const c of columns as string[]) {
        collection.add(c);
      }
    }
    return collection.size !== size;
  }

  /**
   * Show the column.
   */
  remove(columns: PblColumn[] | string[], indirect?: string) {
    let collection: Set<string>;
    if (indirect) {
      collection = this.indirect.get(indirect);
      if (!collection) {
        this.indirect.set(indirect, collection = new Set<string>());
      }
    } else {
      collection = this.hidden;
    }
    const size = collection.size;
    if (columns[0] instanceof PblColumn) {
      for(const c of columns as PblColumn[]) {
        collection.delete(c.id);
      }
    } else {
      for(const c of columns as string[]) {
        collection.delete(c);
      }
    }
    return collection.size !== size;
  }

  clear(onlyHidden: boolean) {
    this.hidden.clear();
    if (!onlyHidden) {
      this.indirect.clear();
      this.allHidden.clear();
    } else {
      this.syncAllHidden();
    }
  }

  syncAllHidden() {
    this.allHidden.clear();
    for (const id of this.hidden) {
      this.allHidden.add(id);
    }
    for (const indirect of this.indirect.values()) {
      for (const id of indirect) {
        this.allHidden.add(id);
      }
    }
    return this;
  }
}
