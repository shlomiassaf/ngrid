import { PblColumn, PblColumnGroup } from '@pebula/ngrid';

declare module '@pebula/ngrid/lib/grid/columns/column' {
  interface PblColumn {

    reorder: boolean;
    /**
     * When true, the item can be reordered based on the `reorder` property but
     * will not move (budge) when other items are reordered.
     */
    wontBudge: boolean;

    /**
     * Checks if the by switching between this column and the provided column the `lockColumns` constraint is triggered.
     * The lockColumns constraint is set on a group and restrict splitting of groups.
     * A Column with a locked group will not be allowed to leave the group nor new items are allowed that split the group.
     *
     * The process will check both scenarios.
     */
    checkGroupLockConstraint(column: PblColumn): boolean;
  }
}

declare module '@pebula/ngrid/lib/grid/columns/group-column' {
  interface PblColumnGroup {
    /**
     * Lock column in the group, preventing the group from splitting.
     * Splitting is block actively (column from the group dragged outside) and passively (column outside of the group dragging into the group).
     */
    lockColumns?: boolean;
  }
}

declare module '@pebula/ngrid/lib/grid/columns/types' {
  interface PblColumnDefinition {
    reorder?: boolean;
    /**
     * When true, the item can be reordered based on the `reorder` property but
     * will not move (budge) when other items are reordered.
     */
    wontBudge?: boolean;
  }
  interface PblColumnGroupDefinition {
    /**
     * Lock column in the group, preventing the group from splitting.
     * Splitting is block actively (column from the group dragged outside) and passively (column outside of the group dragging into the group).
     */
    lockColumns?: boolean;
  }
}

function checkGroupLockConstraint(this: PblColumn, column: PblColumn): boolean {
  for (const id of this.groups) {
    const g = this.groupStore.find(id);
    if (g && g.lockColumns && !column.isInGroup(g)) {
      return false;
    }
  }
  return true;
}

export function colReorderExtendGrid(): void {
  PblColumn.extendProperty('reorder');
  PblColumn.extendProperty('wontBudge');
  PblColumnGroup.extendProperty('lockColumns');

  PblColumn.prototype.checkGroupLockConstraint = function (this: PblColumn, column: PblColumn): boolean {
    return checkGroupLockConstraint.call(this, column) && checkGroupLockConstraint.call(column, this);
  };
}

