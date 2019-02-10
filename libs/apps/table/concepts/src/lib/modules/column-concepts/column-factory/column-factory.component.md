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
  <!--@pebula-example:ex-1-->
  <pbl-ngrid [dataSource]="ds" [columns]="columns" fallbackMinHeight="150"></pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

<!--@pebula-example:ex-2-->
All meta rows are set in the order they we're added.
<!--@pebula-example:ex-2-->

## The static build pitfall

The column factory has 2 steps:

- **Definition**: Adding column configuration (header, table, footer)
- **Build**: Building the `PblTableColumnSet` for the configuration set in the **definition step**

```typescript
/* Definition step */
const factory: PblColumnFactory = columnFactory().table( { prop: 'id' }, { prop: 'name' } );

/* Build step */
const columnSet: PblTableColumnSet = factory.build();
```

In the definition step all data is stored as simple objects (POJO).  
When we build, the factory takes these simple objects and convert them to the relevant column instances (`PblColumn`, `PblMetaColumn`, etc...).

The table is extensible, plugins can add or modify behaviors including addition of new column definitions. For example, the `drag` plugin add the `reorder` property.
to the table column definition.

If we build a column set before a plugin was loaded new definitions added by the plugin might not persist.
To prevent any issues, avoid building column set's statically.

```typescript
const STATIC_COLUMNS = columnFactory()
  .table( { prop: 'id' }, { prop: 'name' } )
  .build();

const COLUMN_FACTORY = columnFactory()
  .table( { prop: 'id' }, { prop: 'name' } );

@Component({
  selector: 'my-component',
  template: '',
})
export class MyComponent {
  staticColumns = STATIC_COLUMNS;                 // BAD

  columns = COLUMN_FACTORY.build();               // GOOD

  columns2 = columnFactory()                      // GOOD
    .table( { prop: 'id' }, { prop: 'name' } )
    .build();
}
```

The `STATIC_COLUMNS` are created before angular runs, maybe even before the plugins are loaded.

The `COLUMN_FACTORY` object is not a column set, it's a factory instance, only when we call `build()` it will return a column set.
Because we call build when the component in instantiated we are sure all plugins are loaded at this point.

W> Plugins are loaded once we `import` them, so in theory if we import the plugins before our components we should be fine. This is true only in theory (and dev mode), in reality (prod)
the bundled output change the order modules are loaded so we can ensure it.
