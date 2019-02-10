# Column Reordering

Changing the display order of a column is supported programmatically (`ColumnApi`) and through the UI (mouse/touch) using the `drag` plugin.

## Using the `ColumnApi`

The `ColumnApi` provides methods for **moving** or **swapping** columns.

Both  **moving** and **swapping** does not enforce business logic, It is up to the caller to implement such.
For example, the `drag` plugin extends the column definition with the `reorder` property and enforce it internally.
The `ColumnApi` does now know anything about `reorder`.

### Moving columns

Moving of a column (**"origin"**) is done relative to another column (**"anchor"**) and effects
all columns between the origin and anchor ("**"group"**)

The **origin** will take the place of the **anchor**, incrementing or decrementing the **anchor** and **group** by 1.
If the origin was **before** the anchor, the anchor and group will move decrement, otherwise increment.

I> Only visible (not hidden) columns can move, if at least one column is hidden the move is rejected.

```typescript
  moveColumn(column: PblColumn, anchor: PblColumn): boolean;
```

It is also possible to provide an index, representing the location of the anchor column.
The index should reflect the position **inside the group of rendered columns**, i.e: the columns that are not hidden.

```typescript
  moveColumn(column: PblColumn, renderColumnIndex: number): boolean;
```

I> We recommend moving with absolute columns, if you are working with index's use the methods in `ColumnApi` to resolve to `PblColumn`

### Swapping columns

Swapping a column is done against another column, resulting in change of position between the two.

Similar to moving, swapping require 2 columns both visible however swapping will only effect these columns
leaving the group of columns between the 2 in the same place.

```typescript
  swapColumns(col1: PblColumn, col2: PblColumn): boolean;
```

<docsi-mat-example-with-source title="Moving with the API" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <button (click)="move(t)">Move id after gender</button><button (click)="swap(t)">Swap name after birthdate</button>
  <pbl-table #t [dataSource]="ds1" [columns]="columns1">
  </pbl-table>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

## Using the `drag` plugin

The `drag` plugin add support for column reordering through mouse or touch and the ability to define which columns are allowed to move.

Let's start with a simple example:

<docsi-mat-example-with-source title="Simple Reordering" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-table columnReorder
             [dataSource]="ds2" [columns]="columns2">
  </pbl-table>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

To enable column reordering:

1. The directive `[columnReorder]` must be applied on the table
2. Each column must have the `reorder` property set to true.

I> When we registered `PblTableDragModule` we used `PblTableDragModule.withDefaultTemplates()` which pre-loads
default templates for the plugin to work out of the box, we will cover customization shortly.

## Locking columns

Notice that we allow reordering for columns **name** and **gender**, but as they change position they move other columns, even if they have `reorder: false`.  
The `reorder` property controls if the column can be dragged or not, nothing more.
To lock a column for reordering we need to enable the `wontBudge` property.

<docsi-mat-example-with-source title="Locking columns" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@pebula-example:ex-3-->
  <pbl-table columnReorder
             [dataSource]="ds3" [columns]="columns3">
  </pbl-table>
  <!--@pebula-example:ex-3-->
</docsi-mat-example-with-source>

We've enabled `wontBudge` in columns **in** and **birthdate**, trying to re-order columns before/after them will not work.  
Notice that we now enabled `reorder` on **birthdate**, it will be able to reorder itself but will not allow others to reorder it.

I> `wontBudge` behaves as a lock, fixating the index of the column. Any column with an index lower then a locked column
will only be able to re-order itself before that column, any position after the locked column will be locked. Same is true
the other way around.

## Reordering columns with groups

By default, a group has no effect on reordering of columns but it is possible to opt-in for a group lock on it's columns.

To enable group columns lock set the `lockColumns` property on the group definitions to **true**.

<docsi-mat-example-with-source title="Group columns locks" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-4'}]">
  <!--@pebula-example:ex-4-->
  <pbl-table columnReorder
             [dataSource]="ds4" [columns]="columns4">
  </pbl-table>
  <!--@pebula-example:ex-4-->
</docsi-mat-example-with-source>

When a group is not locked it can split by a re-order of an other column or one of it's own columns. A locked group does not allow it's own columns
to split, not actively and not passively.

W> Replacing or breaking the relationship between a column and a group is not possible via reordering. To break this relationship a new
group definition is required, creating a new column definition set.

## Customization and manual control

At the beginning, we've mentioned that we opted in for the default templates, these allow easy setup of the reordering feature. To customize the
behavior and/or look of the reordering process we need override these templates.

To override reordering we need to provide a template that the table will use to render the drag element that listen to all mouse/touch events
and act upon them.

To do that we use the structural directive `*pblTableCellDraggerRef`. This directive will automatically register the template for us
and provide us with the **column*** and **table** instances as context:

```typescript
export interface PblTableMetaCellTemplateContext<T> {
  $implicit: PblTableMetaCellTemplateContext<T>;
  col: PblMetaColumn | PblColumn;
  table: PblTableComponent<T>;
}
```

The default re-order template in `PblTableDragModule.withDefaultTemplates()` is fairly simple:

```html
<span *pblTableCellDraggerRef="let ctx" [negTableColumnDrag]="ctx"></span>
```

We use `*pblTableCellDraggerRef` to instruct the table which template to use pass the context to `[negTableColumnDrag]` which does all the reordering business.

`[negTableColumnDrag]` is a directive that the plugin provides. It extends `CdkDrag` adding some logic for the re-order scenario.

### Manual all the way

`[negTableColumnDrag]` is just our way of doing it, for complete custom handling, one might do:

```html
<my-custom-drag-handler *pblTableCellDraggerRef="let ctx" [table]="ctx.table" [column]="ctx.col"></my-custom-drag-handler>
```

`my-custom-drag-handler` will be rendered on each header cell and should take care of all re-order logic.

You can extend `[negTableColumnDrag]`, make it a component, add your custom drag handler icons and more..

I> The `drag` plugin is using `@angular/cdk/drag` as the low level package for handling drag and drop, you can benefit from other
features this library offers when building you own custom solution.
