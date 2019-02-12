# Action Row

Working with tables, we often find that we are using the same patterns.
For example, wildcard filtering, refreshing, adding rows and others...

Let's build an action row, a row with common commands that we can re-use across tables.

Our action row will be able to:

- Display a label for the table
- Display a filter input and filter the table
- Display a refresh button and refresh the table

Here is the final result:

<docsi-mat-example-with-source title="Action Row" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid blockUi [dataSource]="ds1" [columns]="columns">
    <my-table-action-row filter label="My Table"></my-table-action-row>
  </pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

We added the action row with this code:

```html
<my-table-action-row filter label="My Table"></my-table-action-row>
```

`my-table-action-row` is not part of the package, it is a custom component that will add an action row to the table it is defined in.
You can build any kind of action row, in any style and with any functionality you wish.

<docsi-mat-source-code [query]="[
  { file: 'table-action-row.component.ts', lang: 'ts' },
  { file: 'table-action-row.component.html' },
  { file: 'table-action-row.component.scss' }
]"></docsi-mat-source-code>

The functionality of the action row above is not important, it is customizable.
What's important is how it interacts with the table:

```typescript
  @ViewChild('actionRow', { read: TemplateRef }) actionRow: TemplateRef<any>;

  constructor(public table: PblNgridComponent<any>) { }

  ngAfterViewInit(): void {
    this.table.createView('beforeTable', this.actionRow);
  }
```

- We get a reference to the template so we can use it as our action row.
- In the constructor we get a reference to the table, we know it will get injected because we declare the component **inside** the table component.
- In `ngAfterViewInit` we register our action row, we register it in the `beforeTable` section, because we want it on top.

I> As we create views we can also remove them using `removeView`, hence we can also toggle action rows on and off.
