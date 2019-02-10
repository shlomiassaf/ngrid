# Column Groups

A column group is a collection of columns represented as a column header that spans over the child column.

<docsi-mat-example-with-source title="Basic Group Example" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid [dataSource]="ds1" [columns]="columns1"></pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

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

<docsi-mat-example-with-source title="Multi-header Column Groups" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-ngrid [dataSource]="ds2" [columns]="columns2"></pbl-ngrid>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

## Complex Group Hierarchy

Grouping of groups is possible but not supported natively. A column group can only host columns.

Creating a group of groups is possible through definition, simply set the all the children of the groups you want to group
as the children of a single group hosted under a top-level row.

## Additional functionality

Column groups are in most part a UX feature. Plugins might extend it to support advanced features and provide additional usability.

<p>For example, the `drag` plugin provide the ability to <a [routerLink]="['../', 'column-reorder']" [fragment]="'reordering-columns-with-groups'">split groups when moving columns</a>.</p>
