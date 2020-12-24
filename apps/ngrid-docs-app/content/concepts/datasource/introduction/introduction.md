---
title: Introduction
path: concepts/datasource/introduction
parent: concepts/datasource
ordinal: 1
---
# The Data Source

To render rows of data the grid requires a source of data.  
The obvious datasource is the array and in fact at the core of each grid or table an array is used to render the rows.

You can provide the following datasource`s:

- Array - Direct interface
- Promise<Array> - Async interface
- Observable<Array> - Async stream interface
- `PblDataSource` - Async stream interface

**nGrid** supports all of the above but works with `PblDataSource<T>`.
When an array, promise or observable is provided it is converted into `PblDataSource<T>`.

## Array, Promise, Observable

The most primitive source of data is an array of items where each item represents a row in the grid.

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

In simple scenarios this is enough but it stops there, these datasource`s does not scale.

## Scaling up


**nGrid** must support different scenarios with various a lot of features.  
Each feature is required to work in all scenarios.

We can group all of the scenarios into 2 working modes:

- **Client Side** - The entire datasource is in one collection
- **Server Size** - A portion of the datasource is available, getting more items require a manual operation (e.g. calling the server)

With 3 common features: Sorting, Filtering and Pagination.

In **client side** mode the entire logic is local, performed on the entire collection.  
In **server side** this is not possible
and the logic sits on the remote source.

We need to find a simple way to support both modes in a single, easy to use API.  
It has to be simple to use and easy to extend so we can create variations from these groups.

## NGrid's DataSource


To scale up, **nGrid** provides the datasource container `PblDataSource<T>` with a simple to use datasource factory.

Using the `PblDataSource<T>` API you can invoke a manual data update, define the sorters, filters and more.  
Using the factory you can create, define and operate a datasource with a simple API that handles sorting, filtering and pagination for us in client side mode
while providing an dead simple API for reacting to sort, filter and pagination updates in server side mode.

<div pbl-example-view="pbl-working-with-pbl-datasource-example" containerClass="table-height-300 mat-elevation-z7"></div>

I> **Client side** mode does not mean we must have the data locally, we can still fetch it from a remote server but it will be all at once, in once chunk.

## Datasource Factory

Using the datasource factory we define and create the datasource.

The core functionality of the datasource is to provide data and with the factory this is very simple:

```typescript
const dataSource = createDS<Person>()
  .onTrigger( (event) => [] )
  .create();
```

The handler provided to the `onTrigger` method accepts an event object (`PblDataSourceTriggerChangedEvent`) and returns a `DataSourceOf<T>` (array, promise or observable)

The event describes the source of the trigger and any additional data related to the trigger. For example, if the trigger originated from
a pagination change, sort change etc.

Based on the definitions, the factory will trigger events or handle them internally.

I> The datasource factory implements a **Fluent API**

The various scenarios is covered in depth [in here](../factory).
