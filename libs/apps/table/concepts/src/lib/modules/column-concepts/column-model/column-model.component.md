# The Column Model

Columns are the core building blocks of the table. They describe the structure, behavior and appearance.

When **rows** (data items) meet **columns** we get a matrix of **cells** we call a table / grid.

## Column, Rows and Cells

Before we dive, let's take a minute to understand the role of columns, rows and cells.

A table is a visual display of a data model, we describe the data model through columns. Let's illustrate using a class as (our data model) and matching column definitions:

<div fxLayout>
  <div fxFlex="50%">

```typescript
export class Person {
  id: number;
  name: string;
  email: string;
}
```

  </div>
  <div fxFlex="50%">

```typescript
const COLUMN_DEFS = [
  { prop: 'id' },
  { prop: 'name' },
  { prop: 'email' },
];
```

  </div>
</div>

- Each property of `Person` is a data column.
- An instance of `Person` is a row.
- In a `Person` instance the property `name` is a cell.

Let's put a single instance of `Person` into a table:

```typescript
export class Person { id: number;    name: string;    email: string; }
```

And now a real one:

<docsi-mat-example-with-source title="Simple Model" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@neg-example:ex-1-->
  <neg-table style="height: 110px" [dataSource]="dsSimpleModel" [columns]="columnsSimpleModel"></neg-table>
  <!--@neg-example:ex-1-->
</docsi-mat-example-with-source>

We got 2 rows for 1 instance. The first row represents headers for the data columns and the 2nd row the data itself.

I> Every table has 1 data header row, 1 data footer row and **n** amount of  data rows.

I> You can show/hide the data header row using `showHeader` (default: `true`) and the data footer row using `showFooter` (default: `false`)

When a row (data item) meets a column a cell is created, the visual shape of the property. The column provides the value and template and the table
render's the cell.

W> While most columns map to a property on the data model it is not mandatory. A column can also represent a virtual value, similar to class getters.

## Column Types

There are 2 high-level column types:

- **Data Columns** (required) - columns that represent data model
- **Meta Columns** (optional) - columns that does not represent data: Header, Footer, and Group

For each high-level column type there is a high-level row type. A row can only host cells of the same column type!

I> There are more column/row types (e.g. Group header column), but all are subset of the above.

All column types share a set of common definitions, we will review them now and move to each type afterwards.

## Creating Definitions

Together, data and meta columns, define the structure of the table - a data item model.

<p>You can build the column definition from JSON or use the <a [routerLink]="['../', 'column-factory']">columns factory</a>.</p>
When working with simple models using JSON is easy, but once the model is big help is needed, especially with meta headers, group headers etc...

If you're not familiar with the column factory we recommend reading it once you finish this page.

## Column Definition

Each column contains instructions telling the table how to operate, all columns share a basic set of definitions
but because each serve a different purpose they also have unique definitions.

The basic definitions for all columns:

```typescript
export interface NegBaseColumnDefinition {
  /** A Unique ID for the column. */
  id: string;

  /** A text to display in the column */
  label?: string;

  /** The type of the values in this column. */
  type?: string | NegColumnTypeDefinition;

  /** CSS class that get applied on the header and cell. */
  css?: string;

  /**The width in px or % in the following format: ##% or ##px  Examples: '50%', '50px' */
  width?: string;

  /** This minimum width in pixels */
  minWidth?: number;

  /** This maximum width in pixels */
  maxWidth?: number;

  /** A place to store things... */
  data?: any;
}
```

These are the basics, most is self-explaining so we will focus on some.

### Unique ID

First thing to note is that each column has a unique id, this is important for identifying and querying columns.
Some columns will mark the `id` as optional, inferring it internally.

### Column type

The **type** property has an important role, it defines the type of the column which the table can use in a lot of areas.

For example, for the type **number** the table can take the template registered for that type and render the cell with number formatting.
It doesn't have to be data-types, we can also define the type **image** with a matching template that renders an `img` tag.

It does not end there, types can be used to filter, sort and more...

Going back to our model:

<div fxLayout>
  <div fxFlex="50%">

```typescript
export class Person {
  id: number;
}
```

  </div>
  <div fxFlex="50%">

```typescript
const COLUMN_DEFS = [
  { prop: 'id', type: 'number', },
];
```

  </div>
</div>

W> The type does not have to match the property type, for example a string might be an image link have the column type `image` and a matching template with an `<img>` tag.

### Width system

Each column has 3 definitions for width, all are optional.
<p>The table will look at each column and define it's final width based on these inputs relative to other columns in the table. This is covered in depth <a [routerLink]="['../../', 'features', 'column-width']" >here</a></p>

## The Data Column

We've seen that the data column (from here on just column), represent a property on the data item and also the data header and footer cells.

Let's take a look again, this time we enable both header and footer rows and use a collection with 3 `Person` instances:

<div fxLayout>
  <neg-table fxFlex="208px" style="height: 260px" showFooter [dataSource]="ds2" [columns]="columnsSimpleModel2" class="neg-table-cell-ellipsis neg-table-header-cell-ellipsis">
    <div *negTableHeaderCellTypeDef="'dataRow'" parentNgClass="column-model-demo-highlight-data highlight-data-header">DATA ROW (HEADER)</div>
    <div *negTableCellTypeDef="'dataRow'" parentNgClass="column-model-demo-highlight-data">DATA ROW</div>
    <div *negTableFooterCellTypeDef="'dataRow'" parentNgClass="column-model-demo-highlight-data highlight-data-footer">DATA ROW (FOOTER)</div>
  </neg-table>
  <div fxFlex="24px"></div>
  <neg-table fxFlex="*" style="height: 260px" showFooter [dataSource]="ds2" [columns]="columnsSimpleModel" class="neg-table-cell-ellipsis neg-table-header-cell-ellipsis">
    <div *negTableHeaderCellDef="'*'; col as col" style="text-decoration: underline">{{ col.label | uppercase }}</div>
    <div *negTableCellDef="'*'; value as value">-> {{value}} <-</div>
    <div *negTableFooterCellDef="'*'; col as col">({{ col.label }})</div>
  </neg-table>
</div>

I> On the left, 3 row markers, indicating the type of each row.

- There are 3 data columns, with all columns showing the property value **wrapped in -> <-**
- There is 1 header row, with all columns showing the property name with **uppercase** and **underline**.
- There is 1 footer row, with all columns showing the property name **wrapped with parentheses**

In fact, there are 3 templates in play for header, footer and data cells.

I> Data columns can also represent virtual data, not existing on the data item. e.g.: Aggregating multiple properties, timestamps etc...

### Binding a column to a property

Usually, each column is mapped to a property on the data item. Mapping is done by providing the property name (Supporting deep paths including arrays).

```typescript
const person = {
  name: 'John',
  age: 50,
  dog: {
    name: 'Woof'
    }
  };


const columns = [
  { prop: 'name' },
  { prop: 'dog.name', label: 'Dog Name' }
]
```

Instead of dot notation, you can use the **path** property with an array of string as the path to the **prop**

```typescript
const columns = [
  { prop: 'name' },
  { path: ['dog'], prop: 'name', label: 'Dog Name' }
]
```

We did not define an **id**, it is optional in our case. Because the path to the property is unique it will be used as the id. You can override it if you want.

The table will also set the **label**, when not set. It will be the name of the property.

I> These are just the basics, there are more to do with columns. We explore all capabilities on a feature basis in other pages.

## The Meta Column

Meta columns represent metadata, additional data not from the datasource. For example, columns for action buttons, aggregation, filtering, grouping, messaging and what not.

All meta columns require a meta row host and all meta row's are positioned above (header) or below (footer) the data columns. By adding meta columns and assigning them to rows the rows are created. There is no limit to the number of meta rows you can use.

W> Do not confuse the header/footer parts of the data column with header/footer columns. Each data column has only 1 footer/header cell but you can add infinite number of header columns.

To bind a meta column to a meta row we use the **rowIndex** property which references the index of header/footer rows collection.

```typescript
const HEADER_COLUMN_DEFINITION = {
  id: 'myHeaderColumn',
  label: 'A HEADER COLUMN',
  rowIndex: 0,
}
```

In this example, **rowIndex: 0** refers to the first header row from the top.

<p>Assigning row index to a column is quite messy, hard to track and error prone. The <a [routerLink]="['../', 'column-factory']">columns factory</a> comes to the rescue doing
all the indexing for us.</p>

### Header and Footer columns

Header and footer columns are defined with all base definition we covered above.

If a label is provided, it will display but it can also be ignored based on the template.

A table without meta columns. Each data column (id, name, gender, email) is defined once but it can reference 3 templates, header, cell and footer.

<div fxLayout>
  <neg-table fxFlex="208px" style="height: 400px" showFooter [dataSource]="dsSimpleModel" [columns]="columnsWithMeta2" class="neg-table-cell-ellipsis neg-table-header-cell-ellipsis">
    <div *negTableHeaderCellTypeDef="'metaRow'; col as col" parentNgClass="column-model-demo-highlight-header">META ROW ({{ col.label }})</div>
    <div *negTableHeaderCellTypeDef="'dataRow'" parentNgClass="column-model-demo-highlight-data">DATA ROW (HEADER)</div>
    <div *negTableCellTypeDef="'dataRow'" parentNgClass="column-model-demo-highlight-data">DATA ROW</div>
    <div *negTableFooterCellTypeDef="'dataRow'" parentNgClass="column-model-demo-highlight-data">DATA ROW (FOOTER)</div>
    <div *negTableFooterCellTypeDef="'metaRow'; col as col" parentNgClass="column-model-demo-highlight-footer">META ROW ({{ col.label }})</div>
  </neg-table>
  <div fxFlex="24px"></div>
  <neg-table fxFlex="*" style="height: 400px" showFooter [dataSource]="dsSimpleModel" [columns]="columnsWithMeta" class="neg-table-cell-ellipsis neg-table-header-cell-ellipsis"></neg-table>
</div>

In this example, several meta columns are defined - spread across 3 rows.

- A header column in **rowIndex** 0
- A Group header column in **rowIndex** 1
- A footer column in **rowIndex** 0

W> Note that the index count is unique for headers and for footers.
