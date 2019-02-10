# Column Templates

A rendered table is made up of cells and each cell is bound to a column (either meta column or data column).
To render a cell a query is sent to the template registry to find a template that match the cell's column. When no match is found the
default template is used.

I> The default template for all columns will render string values. For **meta columns** the value is the `label` and for **data columns**
it is the value that the `prop` points to on the data item.

## Quick & Dirty

- Templates are defined once and reused across tables and columns.
- Matching templates to columns is done by **id** or **type**
- Design goals:
  - Users will not have to deal with template definitions when working with tables.
  - Column packs will provide cell templates for common column types.

## One template to rule them all

Templates are reusable, we can use them to rendered multiple cells over and over. A single template can be used across the app, defined once and stored for reuse.

All templates are stored in a template registry using a unique key that is used to retrieve them later. The registry supports 2 kind of keys:

- id
- type

To find a template for a column the template key must match the column's `id` or `type` based on the kind of the key.

## The Template Registry

The template registry is built from layers of a template registries connected to each other through the Angular dependency injection system.

This hierarchical system is allow us to define cell templates in the application root component, somewhere in a feature module or as a child of the table component.

Every layer is a registry instance with a connection to it's nearest parent. When we query for a template the registry will look
locally and if not found it will query it's parent.

For every table instance a new registry layer (instance) is created which guarantees a depth of **at least** 2 layers (root -> table).

I> The root registry sits in the root injector.

When the host of the registry is destroyed (e.g. the table component) the registry (and its local templates) is destroyed as well.

## Registering Templates

There are 4 types of cell templates: header, data, edit and footer.

Registering cell templates for all columns with the **id** `avatar`:

```html
  <!-- Header cell template  -->
  <div *negTableHeaderCellDef="'avatar'; col as col">{{ col.label | uppercase }}</div>

  <!-- Data cell template -->
  <div *negTableCellDef="'avatar'; value as value"><img [src]="avatar" /></div>

  <!-- Data Editor cell template -->
  <div *negTableCellEditorDef="'avatar'; value as value"> <input /> </div>

  <!-- Footer cell template -->
  <div *negTableFooterCellDef="'avatar'; col as col">{{ col.label }}</div>
```

Registering cell templates for all columns with the **type** `image`:

```html
  <!-- Header cell template  -->
  <div *negTableHeaderCellTypeDef="'image'; col as col">{{ col.label | uppercase }}</div>

  <!-- Data cell template -->
  <div *negTableCellTypeDef="'image'; value as value"><img [src]="avatar" /></div>

  <!-- Data Editor cell template -->
  <div *negTableCellEditorTypeDef="'image'; value as value"> <input /> </div>

  <!-- Footer cell template -->
  <div *negTableFooterCellTypeDef="'image'; col as col">{{ col.label }}</div>
```

The location of the template will determine the registry used to store it.

For example if set in the application root component it will be registered in the root registry, available to all tables. However, if
set as a child of the table component it will be available only to that table instance an will be destroyed once the table is destroyed.

```html
<pbl-table>
  <div *negTableCellTypeDef="'image'; value as value"><img [src]="avatar" /></div>
</pbl-table>
```

One more time:

```html
<pbl-table></pbl-table>
<pbl-table>
  <div *negTableCellTypeDef="'image'; value as value"> IMAGE 0 </div>
</pbl-table>

<div *negTableCellTypeDef="'image'; value as value"> IMAGE 1 </div>
```

In this example the first table (top) will get the template showing **IMAGE 1** and the 2nd table will get the template shoing **IMAGE 0**

## Default (catch-all) template

For every type of template it is possible to define a default (wild card) template that will be used if no match is found. This is done
by using an **id** cell template definition with the value `'*'`.

```html
  <!-- Header cell template  -->
  <div *negTableHeaderCellDef="'*'; col as col">{{ col.label | uppercase }}</div>

  <!-- Data cell template -->
  <div *negTableCellDef="'*'; value as value"><img [src]="avatar" /></div>

  <!-- Data Editor cell template -->
  <div *negTableCellEditorDef="'*'; value as value"> <input /> </div>

  <!-- Footer cell template -->
  <div *negTableFooterCellDef="'*'; col as col">{{ col.label }}</div>
```

W> When exists, the default template is used instead of passing the query to the parent registry. Registry default templates in the root registry or close.

## Cell Context

A context is attached to every rendered cell, based on the type of the column.

- Data cells - `PblTableCellContext`
- Meta cells - `PblTableMetaCellContext`

### PblTableCellContext

```typescript
export interface PblTableCellContext<T = any> {
  col: PblColumn;
  table: PblTableComponent<T>;

  /**
   * The context for the row
   */
  rowContext: PblTableRowContext<T>,

  /**
   * The data item
   */
  row: T,

  /**
   * A getter and a setter for the value.
   */
  value: any;
  /**
   * The index of the cell within the row
   */
  index: number;
}
```

The cell context provide more functionality and control which was omitted because it is out of scope.
