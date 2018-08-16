import { SgColumnGroupDefinition } from './types';
import { SgMetaColumn } from './meta-column';
import { SgColumn } from './column';

export class SgColumnGroup extends SgMetaColumn implements SgColumnGroupDefinition {

  //#region SgColumnGroupDefinition
  prop: string;
  span: number;
  //#endregion SgColumnGroupDefinition

  /** @internal */
  orgWidth?: string;
  /** @internal */
  columns: SgColumn[];

  constructor(def: SgColumnGroup | SgColumnGroupDefinition, public readonly placeholder = false) {
    super(def instanceof SgColumnGroup
      ? def
      : Object.assign(
          {
            id: `group-${def.prop}-span-${def.span}-row-${def.rowIndex}`,
            kind: 'header' as 'header'
          },
          def
        )
    );
    if (def instanceof SgColumnGroup) {
      this.orgWidth = def.orgWidth;
      this.columns = def.columns.slice();
    } else {
      if (this.width) {
        this.orgWidth = this.width;
      }
    }
    this.prop = def.prop;
    this.span = def.span;
  }

  update(table: SgColumn[]): void {
    const firstId = this.columns[0].id;
    const idx = table.findIndex( c => c.id === firstId);
    if (this.columns) {
      for (const c of this.columns) {
        c.markNotInGroup(this);
      }
    }
    this.columns = table.slice(idx, idx + this.columns.length);
    for (const c of this.columns) {
      c.markInGroup(this);
    }
  }
}
