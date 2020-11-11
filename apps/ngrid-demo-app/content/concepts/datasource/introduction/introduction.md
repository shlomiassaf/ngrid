---
title: Introduction
path: concepts/datasource/introduction
parent: concepts/datasource
ordinal: 1
---
# The Data Source

To render rows of data the table requires a source of data.
A data source an be an array of items or a container of an array of items.

You can provide the following datasources:

- Array - Direct interface
- Promise - Async interface
- Observable - Async stream interface
- `PblDataSource` - Async stream interface

The table supports all of the above but works with `PblDataSource<T>`.
When an array, promise or observable is provided it is converted into `PblDataSource<T>`.

## Array, Promise, Observable

The most primitive source of data is an array of items where each item represents a row in the table.

```typescript
const dataSource = [
  {
    id: 10,
    name: 'John Doe',
    email: 'john.doe@anonymous.com',
  }
];
```

<div pbl-example-view="pbl-datasource-introduction-simple-model-example" containerClass="mat-elevation-z7"></div>

Using a **Promise** adds async functionality and using an **Observable** adds streaming capabilities on top of that.

In simple scenarios this is enough but it stops there, these datasources does not scale.

## Scaling up

The table operates in different scenarios supporting a lot of features. Each feature is required to work in all scenarios.

Let's demonstrate using the 2 most common scenarios:

- Client Side - The entire datasource is in one collection
- Server Size - A portion of the datasource is available, getting more items require a manual operation (e.g. calling the serve)

With 3 common features: Sorting, Filtering and Pagination.

In **client side** mode the entire logic is local, performed on the entire collection. In **server side** this is not possible
and the logic sits on the remote source.

We need to find a simple way to support both scenarios in a single, easy to use API.

## PblDataSource

To scale up the table provides the datasource container `PblDataSource<T>` with a simple to use datasource factory.

Using the `PblDataSource<T>` API you can invoke a manual data update, define the sorters, filters and more.  
Using the factory you can create and define a datasource with a simple API that handles sorting, filtering and pagination for us in client side more
while providing an dead simple API for reacting to sort, filter and pagination updates in server side mode.

<div pbl-example-view="pbl-working-with-pbl-datasource-example" containerClass="table-height-300 mat-elevation-z7"></div>

## Datasource Factory

Using the datasource factory we define and create the datasource.

The core functionality of the datasource is to provide data and with the factory this is very simple:

```typescript
const dataSource = createDS<Person>()
  .onTrigger( (event) => [] )
  .create();
```

The handler provided to the `onTrigger` method accepts the event and returns `DataSourceOf<T>` (array, promise or observable)

The event describes the source of the trigger and any additional data related to the trigger. For example, if the trigger originated from
a pagination change, sort change etc.

Based on the definitions, the factory will trigger events or handle them internally.

I> The datasource factory implements a fluent API

The various scenarios is covered in depth [in here](../factory).

## Advanced scenarios

The datasource factory will work for you almost all use cases, however, sometimes a custom approach is required.

The actual structure of the datasource is split into 2 parts:

- `PblDataSource<T>`
- `PblDataSourceAdapter<T, TData>`

`PblDataSource<T>` handles all external APIs, the adapter implements the logic and the factory binds the two.

For example, the factory that comes with the table is bundled with an adapter that automatically handles sorting, filtering and pagination
(client side mode) but also contains logic that allow "outsourcing" selected operations to the user.

For example, in server side mode opting to manually implement pagination will result in an event triggered every time the pagination changed
expecting a new source of data from the event handler.
