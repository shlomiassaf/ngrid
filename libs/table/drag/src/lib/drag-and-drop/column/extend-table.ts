import { NegColumn, NegColumnGroup } from '@neg/table';

declare module '@neg/table/lib/table/columns/column' {
  interface NegColumn {

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
    checkGroupLockConstraint(column: NegColumn): boolean;
  }
}

declare module '@neg/table/lib/table/columns/group-column' {
  interface NegColumnGroup {
    /**
     * Lock column in the group, preventing the group from splitting.
     * Splitting is block actively (column from the group dragged outside) and passively (column outside of the group dragging into the group).
     */
    lockColumns?: boolean;
  }
}

declare module '@neg/table/lib/table/columns/types' {
  interface NegColumnDefinition {
    reorder?: boolean;
    /**
     * When true, the item can be reordered based on the `reorder` property but
     * will not move (budge) when other items are reordered.
     */
    wontBudge?: boolean;
  }
  interface NegColumnGroupDefinition {
    /**
     * Lock column in the group, preventing the group from splitting.
     * Splitting is block actively (column from the group dragged outside) and passively (column outside of the group dragging into the group).
     */
    lockColumns?: boolean;
  }
}

function checkGroupLockConstraint(this: NegColumn, column: NegColumn): boolean {
  for (const id of this.groups) {
    const g = this.groupStore.find(id);
    if (g && g.lockColumns && !column.isInGroup(g)) {
      return false;
    }
  }
  return true;
}

NegColumn.extendProperty('reorder');
NegColumn.extendProperty('wontBudge');
NegColumn.prototype.checkGroupLockConstraint = function (this: NegColumn, column: NegColumn): boolean {
  return checkGroupLockConstraint.call(this, column) && checkGroupLockConstraint.call(column, this);
}

NegColumnGroup.extendProperty('lockColumns');
