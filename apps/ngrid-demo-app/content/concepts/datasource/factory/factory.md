---
title: Datasource Factory
path: concepts/datasource/factory
parent: concepts/datasource
ordinal: 2
---
# The Data Source Factory

In the [introduction](../introduction) we covered the basic functionality of the datasource factory.

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

* Data - The user requested an update
- Sort - Sort has changed and sorting trigger is enabled
- Filter - Filter has changed and filtering trigger is enabled
- Pagination - Pagination has changed and pagination trigger is enabled

With each trigger the `PblDataSourceTriggerChangedEvent<TData>` object is provided, containing information about the sources for this trigger
and any additional information available.

```typescript
export interface PblDataSourceTriggerChangedEvent<TData = any> {
  id: number,
  filter: PblDataSourceTriggerChange<DataSourceFilter>;
  sort: PblDataSourceTriggerChange<PblNgridDataSourceSortChange>;
  pagination: {
    changed: boolean;
    page: PblDataSourceTriggerChange<any>;
    perPage: PblDataSourceTriggerChange<number>;
  }
  data: PblDataSourceTriggerChange<TData>;


  /**
   * When true this is the first emission of data since the last connection.
   */
  isInitial: boolean;

  /**
   * The origin of this event, whether it is from a data request or from a custom trigger request (filter, sort and/or pagination).
   * Additional types might be added by plugins.
   */
  eventSource: keyof PblDataSourceTriggerChangedEventSource;

  /**
   * Set the total amount of data items.
   * For use with the paginator, update the total length of data items that the current returned source is part of.
   *
   * Use when custom trigger for pagination is enabled (server side mode, in client side mode the length is automatically set)
   */
  updateTotalLength(totalLength: number): void;
}
```

### Data Trigger

**Data** is triggered when the datasource is first attached to the grid (unless `skipInitialTrigger()` is used) and also
manually triggered by calling the `refresh()` method on the datasource.

You can provide an optional value when calling `refresh()`, this object is passed on as a value and you can
access it in the event via `event.data.curr`.

<div pbl-example-view="pbl-manual-datasource-trigger-component" containerClass="table-height-300 mat-elevation-z7"></div>

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

<div pbl-example-view="pbl-enabling-custom-triggers-example-component" containerClass="table-height-300 mat-elevation-z7"></div>

## The Event Source

As explained above there are several sources however, we group them into 2 main groups:

- **data** - for all events triggered from the a data trigger
- **customTrigger** - for all events triggered from Sort, Filter and / or Pagination trigger

We pass this value in the `eventSource` property which can accepts any value that is the key of `PblDataSourceTriggerChangedEventSource`

```typescript
export interface PblDataSourceTriggerChangedEventSource {
  /**
   * The source of the event was a data request. Either via `refresh()` or the initial data request.
   */
  data: true;
  /**
   * The source of the event was a change in the filter, sort, pagination or a combination of them.
   */
  customTrigger: true;
}
```

For now, the only 2 groups are **data** & **customTrigger** however plugins and extensions can extend this list and add more sources.

I> For example, the **infinite-scroll** plugin adds the **infiniteScroll** event source which indicates that the trigger for the
event was from an infinite scroll action which led to the need to get more rows from the server

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

Now, the datasource will not fetch data on load and the grid will remain empty until the `refresh()` method is called on the datasource.

## Keep Alive

By default the datasource will be bound to the grid, once the grid component is destroyed the datasource is destroyed.  
This is usually the preferred behavior as it automatically manage memory cleanup for the datasource.

We can change the default behavior and keep the datasource around even if the grid is destroyed.  
This means that we must destroy the datasource manually or we will experience memory leaks.

This behavior is useful when moving a datasource between grids, e.g. `*ngIf`

To persist the datasource between grid we use `keepAlive()`:

```typescript
const dataSource = createDS<Person>()
  .keepAlive()
  .onTrigger( (event) => [] )
  .create();
```
