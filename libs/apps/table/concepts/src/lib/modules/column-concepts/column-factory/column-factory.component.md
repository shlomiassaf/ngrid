# The Column Factory

The goal of the column factory is to help us construct column structures for the table.

The column factory features:

- Fluent API
- Default column definition
- Automatic assignment of header/footer/group columns into rows

For simple column structures it might not seem to do much:

<div fxLayout>
  <div fxFlex="50%">

```typescript
const columnsSimpleModel = {
  table: [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'email' },
  ],
};
```

  </div>
  <div fxFlex="50%">

```typescript
const columnsSimpleModel = columnFactory()
  .table(
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'email' },
  )
  .build();
```

  </div>
</div>

But it comes handy when we have a complex column structure with multiple meta rows or when we want default values.

Let's take this made up requirement for a table:

- Columns: ID, Name, Gender, Email, Country, Language
- A header row with 2 columns
  1. Use the label **Header1** and set the width to 25%
  2. Use the label **Header2**
- A group row with 1 group
  1. Group the columns Name & Gender
- A header row with 1 column
  1. Use the label **Header3**
- A group row with 2 groups
  1. Group the columns ID, Name & Gender
  2. Group the columns Country & Language
- A footer row with 2 columns
  1. Use the label **Footer1** and set the width to 25%
  2. Use the label **Footer2**
- A footer row with 1 column
  1. Use the label **Footer3**

And: All columns must be at least 40px wide.

<docsi-mat-example-with-source title="Column Factory" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@neg-example:ex-1-->
  <neg-table [dataSource]="ds" [columns]="columns" fallbackMinHeight="150"></neg-table>
  <!--@neg-example:ex-1-->
</docsi-mat-example-with-source>

<!--@neg-example:ex-2-->
All meta rows are set in the order they we're added.
<!--@neg-example:ex-2-->
