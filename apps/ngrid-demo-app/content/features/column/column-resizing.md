---
title: Column Resize
path: features/column/column-resize
parent: features/column
ordinal: 7
---
# Column Resizing

Changing the size of a column is supported programmatically (`ColumnApi`) and through the UI (mouse/touch) using the `drag` plugin.

## Using the `ColumnApi`

Resizing a column requires the column and the new width. The width can be set in pixels or percentage similar to the width property
in the column definitions.

```typescript
  resizeColumn(column: PblColumn, width: string): void;
```

<div pbl-example-view="pbl-resizing-with-the-api-example"></div>

W> `resizeColumn()` does not enforce business logic, It is up to the caller to implement such.
For example, the `drag` plugin will enforce the `resize` property to enable/disable resizing through mouse/touch. It will also
enforce minWidth/maxWidth boundaries which the `resizeColumn()` ignores. 

## Using the `drag` plugin

The `drag` plugin add support for column resizing through mouse or touch and the ability to define which columns are allowed to resize.
Let's start with a simple example, enabling resize for columns **name** and **gender**:

<div pbl-example-view="pbl-column-resize-example"></div>

To enable column resizing each column must have the `resize` property set to true.

I> When we registered `PblNgridDragModule` we used `PblNgridDragModule.withDefaultTemplates()` which pre-loads
default templates for the plugin to work out of the box, we will cover customization shortly.

The default template does not include a resize handler but it is there, hover over the right
edges of one of the columns **name** OR **gender**  and try to resize them.

W> The `resize` property in the column definition is enforced by the `drag` plugin and not the `ColumnApi`, the API will
resize any column ignoring business logic.

### Resizing constraints

Notice that you can resize the columns **name** and **gender** to any size, even to an invisible one.  
To provide boundaries use the `minWidth` and `maxWidth` properties in the column API.

<div pbl-example-view="pbl-resize-boundaries-example"></div>

We've limited **name** to a minimum width of 100px and maximum width of 400px and **gender** to a minimum width of 50px.

### Customization and manual control

At the beginning, we've mentioned that we opted in for the default templates, these allow easy setup of the resizing feature. To customize the
behavior and/or look of the resizing process we need override these templates.

To override resizing we need to provide a template that the table will use to render the drag element that listen to all mouse/touch events
and act upon them.

To do that we use the structural directive `*pblNgridCellResizerRef`. This directive will automatically register the template for us
and provide us with the **column*** and **table** instances as context:

```typescript
export interface PblNgridMetaCellTemplateContext<T> {
  $implicit: PblNgridMetaCellTemplateContext<T>;
  col: PblMetaColumn | PblColumn;
  table: PblNgridComponent<T>;
}
```

The default resizing template in `PblNgridDragModule.withDefaultTemplates()` is fairly simple:

```html
<pbl-ngrid-drag-resize *pblNgridCellResizerRef="let ctx" [context]="ctx"></pbl-ngrid-drag-resize>
```

We use `*pblNgridCellResizerRef` to instruct the table which template to use pass the context to `pbl-ngrid-drag-resize` which does all the resizing business.

`pbl-ngrid-drag-resize` is a component that the plugin provides. It extends `CdkDrag` adding some logic for the resizing scenario.
It accepts a content which it will display, allowing you to control the handle's look and feel.

<div pbl-example-view="pbl-custom-resizing-example"></div>

Notice how we also use groups in this example, resizing will cause the groups to follow.

### Manual all the way

This is just our way of doing it, for complete custom handling, one might do:

```html
<my-custom-drag-handler *pblNgridCellResizerRef="let ctx" [table]="ctx.table" [column]="ctx.col"></my-custom-drag-handler>
```

`my-custom-drag-handler` will be rendered on each header cell and should take care of all resizing logic.

I> The `drag` plugin is using `@angular/cdk/drag` as the low level package for handling drag and drop, you can benefit from other
features this library offers when building you own custom solution.
