# Column Resizing

Changing the size of a column is supported programmatically (`ColumnApi`) and through the UI (mouse/touch) using the `drag` plugin.

## Using the `ColumnApi`

Resizing a column requires the column and the new width. The width can be set in pixels or percentage similar to the width property
in the column definitions.

```typescript
  resizeColumn(column: PblColumn, width: string): void;
```

<docsi-mat-example-with-source title="Resizing with the API" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <button (click)="resize(negTable1)">Resize id to 200px</button>
  <button (click)="negTable1.autoSizeColumnToFit()">Fit Content</button>
  <pbl-table #negTable1 [dataSource]="ds1" [columns]="columns1" class="pbl-table-cell-ellipsis pbl-table-header-cell-ellipsis"></pbl-table>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

W> `resizeColumn()` does not enforce business logic, It is up to the caller to implement such.
For example, the `drag` plugin will enforce the `resize` property to enable/disable resizing through mouse/touch. It will also
enforce minWidth/maxWidth boundaries which the `resizeColumn()` ignores. 

## Using the `drag` plugin

The `drag` plugin add support for column resizing through mouse or touch and the ability to define which columns are allowed to resize.
Let's start with a simple example, enabling resize for columns **name** and **gender**:

<docsi-mat-example-with-source title="Simple Resizing" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-table [dataSource]="ds2" [columns]="columns2" class="pbl-table-cell-ellipsis pbl-table-header-cell-ellipsis"></pbl-table>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

To enable column resizing each column must have the `resize` property set to true.

I> When we registered `PblTableDragModule` we used `PblTableDragModule.withDefaultTemplates()` which pre-loads
default templates for the plugin to work out of the box, we will cover customization shortly.

The default template does not include a resize handler but it is there, hover over the right
edges of one of the columns **name** OR **gender**  and try to resize them.

W> The `resize` property in the column definition is enforced by the `drag` plugin and not the `ColumnApi`, the API will
resize any column ignoring business logic.

### Resizing constraints

Notice that you can resize the columns **name** and **gender** to any size, even to an invisible one.  
To provide boundaries use the `minWidth` and `maxWidth` properties in the column API.

<docsi-mat-example-with-source title="Resize boundaries" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@pebula-example:ex-3-->
  <pbl-table [dataSource]="ds3" [columns]="columns3"></pbl-table>
  <!--@pebula-example:ex-3-->
</docsi-mat-example-with-source>

We've limited **name** to a minimum width of 100px and maximum width of 400px and **gender** to a minimum width of 50px.

### Customization and manual control

At the beginning, we've mentioned that we opted in for the default templates, these allow easy setup of the resizing feature. To customize the
behavior and/or look of the resizing process we need override these templates.

To override resizing we need to provide a template that the table will use to render the drag element that listen to all mouse/touch events
and act upon them.

To do that we use the structural directive `*negTableCellResizerRef`. This directive will automatically register the template for us
and provide us with the **column*** and **table** instances as context:

```typescript
export interface PblTableMetaCellTemplateContext<T> {
  $implicit: PblTableMetaCellTemplateContext<T>;
  col: PblMetaColumn | PblColumn;
  table: PblTableComponent<T>;
}
```

The default resizing template in `PblTableDragModule.withDefaultTemplates()` is fairly simple:

```html
<pbl-table-drag-resize *negTableCellResizerRef="let ctx" [context]="ctx"></pbl-table-drag-resize>
```

We use `*negTableCellResizerRef` to instruct the table which template to use pass the context to `pbl-table-drag-resize` which does all the resizing business.

`pbl-table-drag-resize` is a component that the plugin provides. It extends `CdkDrag` adding some logic for the resizing scenario.
It accepts a content which it will display, allowing you to control the handle's look and feel.

<docsi-mat-example-with-source title="Custom resizing" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-4'}]">
  <!--@pebula-example:ex-4-->
  <pbl-table [dataSource]="ds4" [columns]="columns4">
    <pbl-table-drag-resize *negTableCellResizerRef="let ctx" [context]="ctx" [grabAreaWidth]="8">
      <span class="pbl-table-column-resizer-handle"></span>
    </pbl-table-drag-resize>
  </pbl-table>
  <!--@pebula-example:ex-4-->
</docsi-mat-example-with-source>

Notice how we also use groups in this example, resizing will cause the groups to follow.

### Manual all the way

This is just our way of doing it, for complete custom handling, one might do:

```html
<my-custom-drag-handler *negTableCellResizerRef="let ctx" [table]="ctx.table" [column]="ctx.col"></my-custom-drag-handler>
```

`my-custom-drag-handler` will be rendered on each header cell and should take care of all resizing logic.

I> The `drag` plugin is using `@angular/cdk/drag` as the low level package for handling drag and drop, you can benefit from other
features this library offers when building you own custom solution.
