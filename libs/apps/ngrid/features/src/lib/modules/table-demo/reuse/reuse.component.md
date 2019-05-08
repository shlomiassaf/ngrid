# Table Re-Use

Reusing of a table refers to changing the model that the table represents.

Looking at the following column factory the model is quite clear:

```typescript
columnFactory()
  .table(
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'email' },
  )
  .build();
```

For this column definition set, the table expects a similar collection of objects returned from the data source.

The datasource is dynamic, returning values per demand.

```typescript
createDS<Person>()
  .onTrigger( (event) => [ { id: 1, name: 'John', email: 'N/A' }] )
  .create();
```

Now, if we want to apply a different model on the table? We will have to change the column definition set as well at the datasource.

In the following example the table can toggle between showing a **Person** model or a **Seller** model.

<docsi-mat-example-with-source title="Re-Use" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid blockUi usePagination [dataSource]="dynamicColumnsDs" [columns]="dynamicColumns">
      <pbl-ngrid-paginator *pblNgridPaginatorRef="let table"
                           [table]="table"
                           [paginator]="table.ds.paginator"></pbl-ngrid-paginator>
      </pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

<button (click)="toggleViewMode()">{{ viewMode }}</button>

When we toggle, notice that we swap the entire datasource. We could have implemented the logic inside the `onTrigger` handler and keep a single datasource but it will not work.

When we swap a datasource the table will cleanup the context and all column related data and rebuilt it preventing ghost context living in the cache.

I> When a table gets destroyed (`ngOnDestroy`) the datasource attached to it (if attached) is disconnected and automatically disposed. This has 1 exception, the `keepAlive` configuration was enabled on the datasource.

W> When you swap the datasource it will also cause the previous datasource to disconnect, if `keepAlive` is `false` it will also dispose itself.
