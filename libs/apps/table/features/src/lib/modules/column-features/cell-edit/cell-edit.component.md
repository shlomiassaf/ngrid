# Cell Edit

Cell editing is supported programmatically (`ColumnApi`) and through the UI (mouse/touch) using the `target-events` plugin.

Let's start with a simple example:

<docsi-mat-example-with-source title="Simple cell edit" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid [dataSource]="ds1" [columns]="columns1">
    <div *pblTableCellDef="'ttt'; let ctx">
      {{!!ctx.rowContext.firstRender}}
    </div>
    <div *pblTableCellDef="'name'; let ctx">
      <a (click)="ctx.startEdit(true)">{{ ctx.value }}</a>
    </div>
    <div *pblTableCellEditorDef="'name'; let ctx">
      <input #input [value]="ctx.value" [pblCellEditAutoFocus]="ctx" (change)="ctx.value = $event.target.value" (blur)="ctx.stopEdit()" />
    </div>
  </pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

Clicking on the name will trigger an input box, leaving the input box (blur) will return to the read-only view.

I> If you wondering what is the `[pblCellEditAutoFocus]` directive, it is just a simple *helper* directive that will handle auto-focusing logic of
the input element.

## Edit Template

<p>An edit template is one of <a [routerLink]="['../..', 'concepts', 'column-templates']">several template types</a> we can attach to a data column.</p>

The `edit template` acts as the **write-only** cell view and the `main template` is the **read-only** cell view. For cells to be *editable* they
must belong to a column with an edit template.

I> There is no default edit template, you can use `*` to define one but the table does not include one like it does for the main template.

In the example above there are 2 cell definitions inside the table that handle the `name` column:

- `pblTableCellDef` defining the read-only view of the cell
- `pblTableCellEditorDef` defining the write view of the cell.

These are the specific property directives definitions, there are also type based definitions:

- `pblTableCellTypeDef` defining the read-only view of the cell
- `pblTableCellEditorTypeDef` defining the write view of the cell.

```html
<div *pblTableCellDef="'name'; let ctx">
  <a (click)="ctx.startEdit()">{{ ctx.value }}</a>
</div>
```

The read-only definition is straight-forward, the main change is that we use the cell context to invoke a `startEdit()` command.

```html
<div *pblTableCellEditorDef="'name'; let ctx">
  <input #input [value]="ctx.value" (change)="ctx.value = $event.target.value" (blur)="ctx.stopEdit()" (ngAfterViewInit)="input.focus()"/>
</div>
```

The write only view also make use if the cell context (`PblTableCellContext) to assign the new value and to exit editing when the input is out of focus.

### Cell context

The cell context is used to toggle between write and read view's, i.e. toggle between the edit and main templates.

We start editing by invoking `PblTableCellContext.startEdit()` and stop editing with `PblTableCellContext.stopEdit()`.

W> An edit template is mandatory. Calling `PblTableCellContext.startEdit()` when the column does not have an edit template will be ignored.
Note that this is the only restriction.

## The `editable` definition

The column definitions include the `editable` property, indicating if a column is editable or not.
When set to `true` (and an edit template exists) the cell will include the CSS class **pbl-table-editable-cell**.

The `editable` flag has no impact in `PblTableCellContext.startEdit()` but it might be used by plugins or by the developer to
create *editing logic*

For example, the directives `cellEditClick` / `cellEditDblClick` (**target-events** plugin) allow simple editing integration that
use mouse/touch inputs to toggle editing and use the `editable` flag to determine if a cell is editable or not.

## Triggering edits globally

The previous example was naive, triggering of cell edit for a specific cell. For scale we want to be able to trigger cell edit
at a higher level, once for all editable cells.

For this we make use of the `target-events` plugin that allow us to handle specific cell events in a single place.

<docsi-mat-example-with-source title="Triggering edits globally" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-ngrid (cellClick)="$event.context.startEdit()"
             [dataSource]="ds2" [columns]="columns2">
    <div *pblTableCellDef="'name'; let ctx">
      <a (click)="ctx.startEdit(true)">{{ ctx.value }}</a>
    </div>
    <div *pblTableCellEditorDef="'name'; let ctx">
      <input [value]="ctx.value" [pblCellEditAutoFocus]="ctx" (change)="ctx.value = $event.target.value" (blur)="ctx.stopEdit()" />
    </div>
    <div *pblTableCellEditorDef="'lead'; let ctx">
      <input type="checkbox" [checked]="ctx.value"
             [pblCellEditAutoFocus]="ctx"
             (change)="changeCheckbox(cb, ctx)"
             (blur)="ctx.stopEdit()" />
    </div>
  </pbl-ngrid>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

This time, clicking on a cell in the **lead** column will start edit mode.

```html
<pbl-ngrid (cellClick)="$event.context.startEdit()"
            [dataSource]="ds2" [columns]="columns2">
  <div *pblTableCellEditorDef="'lead'; let ctx">
    <input #cb type="checkbox" [checked]="ctx.value"
            (change)="changeCheckbox(cb, ctx)"
            (blur)="ctx.stopEdit()"
            (ngAfterViewInit)="cb.focus()"/>
  </div>
</pbl-ngrid>
```

Now we only need to defined an edit template for the cell and let the table handle the click events.  
This time we used `(cellClick)` but we can also use `(cellDblClick)`

When the checked value changes we use a method to assign the new value and stop cell editing:

```typescript
changeCheckbox(input: HTMLInputElement, ctx: PblTableCellContext): void {
  ctx.value = input.checked;
  setTimeout( () => ctx.stopEdit(true) );
}
```

Some notes:

- We use `setTimeout` to defer the operation because we are probably within a `click` event which will will start editing right after we stop it.
- We set `markForCheck` to true (`ctx.stopEdit(true)`) to tell the table that something has changed (the editor template is now the read-only template).

I> We make use of `ctx.startEdit()` and `ctx.stopEdit()` without safety checks, some cell's might not have a cell edit template, some might be editing
while we call `ctx.startEdit()`. This is safe because both methods will check that the above conditions are met.

## Cell edit directives

Up to this point we've triggered editing using listeners to click events and without using column metadata.

The `target-events` plugin comes with a directive that simplify the process, this directive will allow edit for columns with an edit template and
the `editable` property set to true.

<docsi-mat-example-with-source title="Cell edit directives" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@pebula-example:ex-3-->
  <pbl-ngrid cellEditClick
             [dataSource]="ds3" [columns]="columns3">
    <div *pblTableCellEditorTypeDef="'date'; let ctx">
      <mat-form-field>
        <input matInput [matDatepicker]="picker" [value]="ctx.value"
               (dateChange)="ctx.value = $event.value">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker [opened]="true" (closed)="ctx.stopEdit()"></mat-datepicker>
      </mat-form-field>
    </div>
  </pbl-ngrid>
  <!--@pebula-example:ex-3-->
</docsi-mat-example-with-source>

In this example we've used an advanced editing component, the data picker from `@angular/material2` applied on every column
of type `date`, in our case the **birthdate** column.

We used the `cellEditClick` directive to apply cell editing when a click event is fired on a cell, for double click we will use `cellEditDblClick`.
