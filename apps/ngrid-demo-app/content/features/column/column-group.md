---
title: Column Group
path: features/column/column-group
parent: features/column
ordinal: 2
---
# Column Group

A column group is a collection of columns represented as a column header that spans over the child column.

<div pbl-example-view="pbl-column-group-example"></div>

In the example we have 2 groups, for columns **name** and **gender** and for **country** and **language**.

The width of each group is the sum of the widths of it's child columns. When a column change size, hide or move the parent column group
will resize to fit.

W> Column group width definitions have no effect, their width is determined by the child columns only.

## Column Group Definition

The definition of a column group describe which child columns are in the group. This is done by providing the id of the first child column
in the **prop** property and the number of column to take after the first child column in the **span** property.

The definition is linear and does not allow picking random child columns by id, this is because:

- The columns definition is also linear and static
- Avoiding magic string (column id) references as much as possible

In addition, each column group must describe which row it belongs to using the **rowIndex** property.

```typescript
export interface PblColumnGroupDefinition extends PblBaseColumnDefinition {

  id?: string;

  rowIndex: number;

  prop: string;

  span: number;
}
```

W> Once defined, child columns can not leave the group.

## Group Row

A group row is a header row but only for columns groups.

A table can host multiple header rows including multiple group rows, when setting the **rowIndex** the following rules apply:

- Column groups on the same row can not share child columns
- Column groups can not mix with column headers on the same row

<p>This can become hard to track, luckily for us the <a [routerLink]="['../', 'column-factory']">columns factory</a>  will strip the complexity for us.</p>

<div pbl-example-view="pbl-multi-header-column-group-example"></div>

## Complex Group Hierarchy

Grouping of groups is possible but not supported natively. A column group can only host columns.

Creating a group of groups is possible through definition, simply set the all the children of the groups you want to group
as the children of a single group hosted under a top-level row.

## Additional functionality

Column groups are in most part a UX feature. Plugins might extend it to support advanced features and provide additional usability.

<p>For example, the `drag` plugin provide the ability to <a [routerLink]="['../', 'column-reorder']" [fragment]="'reordering-columns-with-groups'">split groups when moving columns</a>.</p>
