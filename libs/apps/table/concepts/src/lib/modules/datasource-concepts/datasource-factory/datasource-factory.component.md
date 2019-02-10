# The Data Source Factory

<p>In the <a [routerLink]="['../', 'datasource-introduction']">introduction</a> we covered the basic functionality of the datasource factory.</p>

```typescript
const dataSource = createDS<Person>()
  .onTrigger( (event) => [] )
  .create();
```

We provide a function to `onTrigger()` that returns `DataSourceOf<T>` which is a our datasource. The function can
return a local collection or call the server to get a collection.

I> `DataSourceOf` can be an Array, Promise or Observable.

I> When creating a datasource, do it inside the class and apply the trigger handler using an arrow function. This will give you access to the class instance.

The factory contains internal logic that controls the trigger, calling it based on the configuration.

## Trigger Configuration

The trigger is called when a data update is required by a source, the sources are:

- Manual - The user requested an update (manual trigger)
- Sort - Sort has changed and sorting trigger is enabled
- Filter - Filter has changed and filtering trigger is enabled
- Pagination - Pagination has changed and pagination trigger is enabled

With each trigger the `NegDataSourceTriggerChangedEvent<TData>` object is provided, containing information about the sources for this trigger
and any additional information available.

```typescript
export interface NegDataSourceTriggerChange<T> {
  changed: boolean;
  prev: T;
  curr?: T;
}

export interface NegDataSourceTriggerChangedEvent<T = any> {
  filter?: NegDataSourceTriggerChange<DataSourceFilter>;
  sort?: NegDataSourceTriggerChange<NegTableDataSourceSortChange>;
  pagination: {
    changed: boolean;
    page: NegDataSourceTriggerChange<any>;
    perPage: NegDataSourceTriggerChange<number>;
  }
  data: NegDataSourceTriggerChange<T>;

  /**
   * Set the total length of the paginator (for server-side rendering, client-side pagination is automatically set)
   */
  updateTotalLength(totalLength: number): void;
}
```

Each property represent a trigger source (data represent the manual source).

### Manual Trigger

A manual trigger is fired through the datasource by calling the `refresh()` method. It is also possible
to provide an object that is passed on as a value.

<docsi-mat-example-with-source title="Manual Trigger" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <button *ngFor="let count of [50, 100, 500, 1000]" mat-stroked-button (click)="refresh(count)">{{ count }} Rows</button>
  <pbl-table [dataSource]="dsManualTrigger" [columns]="columns"></pbl-table>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

In this example each button will trigger a refresh with a passed parameter, the number of items to return.

Note that we provide a second type parameter to the factory function:

```typescript
createDS<Person, number>()
```

This will set the type in the `data` property of the event. This type is by default `T[]` so `createDS<Person>()` is actually `createDS<Person, Person[]>()`

### Sort, Filter and Pagination trigger

Let's review the source for each trigger:

- Sort - Calling the `setSort` method on the datasource
- Filter - Calling the `setFilter` method on the datasource
- Pagination - Changes in the paginator event (page, itemsPerPage)

The default behavior is suited for client side mode where all data is available in a single collection. In this scenario the triggers are handled
internally because all the information requires is available to the factory.

To enable custom triggering we need to tell the factory which one, during the definition.

```typescript
const dsCustomTrigger = createDS<Person>()
  .setCustomTriggers('pagination', 'sort')
  .onTrigger( () => this.datasource.getPeople(0, 500) )
  .create();
```

This is suitable for remote data sources that return paginated responses (which forces sorting and filtering on the server).

For demonstration we enabled **pagination** and **sorting**, but NOT **filtering**, which will result in a per page filter behavior.

<docsi-mat-example-with-source title="Enabling custom triggers" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-table [dataSource]="dsCustomTrigger" [columns]="columns" usePagination>
    <pbl-table-paginator *negTablePaginatorRef="let table"
                         [table]="table"
                         [paginator]="table.ds.paginator"></pbl-table-paginator>
  </pbl-table>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

## Skipping initial update

By default the datasource will invoke an initial trigger once it is created, this is usually preferred.

In some scenarios, usually in server side mode, we want to defer this trigger and call it manually at a later point in time.
For example, once we get some input parameters from the user or once other calls finish.

To skip the initial trigger we use `skipInitialTrigger()`:

```typescript
const dataSource = createDS<Person>()
  .skipInitialTrigger()
  .onTrigger( (event) => [] )
  .create();
```

## Keep Alive

By default the datasource will be bound to the table, once the table component is destroyed the datasource is destroyed.
This is usually the preferred behavior as it automatically manages memory cleanup for the datasource.

We can change the default behavior and keep the datasource around even if the table is destroyed. This will require that
we destroy the datasource manually or we will experience memory leaks.

This is behavior is useful when moving a datasource between tables, e.g. `*ngIf`

To persist the datasource between tables we use `keepAlive()`:

```typescript
const dataSource = createDS<Person>()
  .keepAlive()
  .onTrigger( (event) => [] )
  .create();
```
