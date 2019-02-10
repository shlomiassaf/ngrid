# Datasource Quickthrough

The source for data items that show up as rows in the table.

- The data source represents a container of data items
- The table's datasource is `PblDataSource`
- `Array`, `Promise<Array>` and `Observable<Array>` are also supported, internally transformed to `PblDataSource`
- We will use a factory function to define and create `PblDataSource` (manual creation is possible)

## Datasource Factory Definitions

The definitions are based on the scenario we need to support.

There are 2 main scenarios the support all most all use-cases:

- Client side: The entire datasource is available in one collection
- Server side: A portion of the datasource is available

I> While rare, handling other scenario is possible through custom factory implementations.

For all scenarios there is one mandatory requirement - **telling the factory how to fetch data**.

Other definitions will determine the desired **behavior**:

- How changes in filtering, sorting and pagination are handled
- Does the datasource die with the table or kept alive so it can move between tables?
- Does the datasource initialize automatically or we want to wait before fetching data for the first time?

I> The **behavior** we define supports the scenario we are in and effect how we fetch data.

## Client Side

This is the default scenario, we only need define how to fetch data:

```typescript
const dataSource = createDS<Person>()
  .onTrigger( (event) => [] ) // or call a remote server to get all data...
  .create();
```

In the example above we return a simple array but `Promise<Array>` and `Observable<Array>` are also supported.

Because all of the collection is available the handling of filtering, sorting and pagination is done for us.

I> Note that filtering and sorting require matching descriptors but the entire streaming of the data is handled for us.

## Server Side

In this mode we only have access to subset of the collection, the best example here is paginated collections.
Usually we want to handle all 3, filtering, sorting and pagination.

```typescript
const dsCustomTrigger = createDS<Person>()
  .setCustomTriggers('filter', 'pagination', 'sort')
  .onTrigger( event => /* get data from a remote server using filter,sort and pagination data stored in "event" */ )
  .create();
```

We use `setCustomTriggers()` to opt-in for custom handling. When pagination data changes or when a filter or sort descriptor changes
the function we provided to `onTrigger()` gets invoked with the `event` object `PblDataSourceTriggerChangedEvent`.

We use the `event` object to extract the information we need to make the call to the server, this will include (among other data):

- Pagination data (current page, current items per page, etc...)
- Current sort descriptor (The active sorted column and the sort direction)
- Current filter descriptor (the text to filter by and which fields (columns) to apply it on)

W> The filter descriptor also accepts a predicate function, avoid using predicates in server side mode as it makes no sense.
