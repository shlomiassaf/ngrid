---
title: Infinite Scroll
path: features/grid/infinite-scroll
parent: features/grid
ordinal: 5
---
# Infinite Scroll

Infinite scrolling provides the feeling of an infinite grid where the user scroll and scrolls until no more data is available but the
data is loaded in incremental steps, every time the grid is scrolling to the end a new dataset is fetched from the server.

We've covered the 2 datasource modes and how we can use them, let's recap:

1. **Client Mode**
The entire dataset is provided once. Sorting, pagination and filtering are done on the client without calling an external source.

2. **Server Mode**
The dataset is provided from the server in chunks. Sorting, pagination and filtering are done on the server.

**Infinite scrolling** is not a mode per-se as it can work with both modes above but it is actually used when working with the server.  

**Infinite scrolling** is an alternative to **pagination**, instead of the user having to click on a button/link to navigate between the next/pervious chunk of the dataset
with **Infinite scrolling** the next/pervious chunk is loaded automatically based on the user's scroll position.

## Infinite scrolling VS Virtual scrolling

Infinite scrolling & Virtual scrolling are often mis-understood:

- **Virtual scroll** enable the display of large datasets in the grid
- **Infinite scroll** enable seamless lazy loading of additional data rows into the grid  

Usually you will use both together, especially when using infinite scroll to add rows (as opposed to replacing rows)

## Creating Infinite Scroll

For a simple experience it is relatively simple to create an infinite scrolling experience using the common grid API:

<div pbl-example-view="pbl-infinite-scroll-example"></div>

This should give you an idea what's going on and what is the logic.  
The basic idea does not change and from here it's just adding fancy stuff like caching, min/max, data normalization etc...
and creating a consistent developer experience when working with infinite scrolling.

## Infinite Scroll Data Source

**nGrid** comes with a built-in infinite scroll datasource that simplifies the logic and makes it simple
to define, mange and update infinite scroll grids.

To create an infinite scroll datasource we use `createInfiniteScrollDS()`.

`createInfiniteScrollDS` is similar to `createDS` with the exception of the trigger handler which is more rich
with data required to manage the lifecycle of an infinite scroll grid.

```typescript
 createInfiniteScrollDS<Person>()
    .onTrigger(event => {
      if (event.isInitial) { // first call to populate, not due to scrolling...
        return [];
      } else { // call's coming from user scrolling, more data rows needed
        return [];
      }
    })
    .create();
```

<div pbl-example-view="pbl-infinite-scroll-data-source-example"></div>

<div pbl-example-view="pbl-index-based-paging-example"></div>

### Handling `onTrigger` Events

The event handler has the following additional properties:

```typescript
export interface PblInfiniteScrollTriggerChangedEvent<TData = any> extends PblDataSourceTriggerChangedEvent<TData> {
  /**
   * The total length currently defined
   */
  totalLength: number;

  /**
   * When true, indicates that the fetching is done for the last block / page in the datasource.
   * It means that the this trigger event will fetch the items located at the end of the data source.
   *
   * This situation depends on the block size and `PblInfiniteScrollDsOptions.minBlockSize` definition and
   * the fact that a datasource size is defined either through `PblInfiniteScrollDsOptions.initialDataSourceSize` or
   * dynamically through `PblDataSourceTriggerChangedEvent.updateTotalLength()`.
   *
   * You can use this flag to detect this scenario and extend / enlarge the datasource total size if needed.
   *
   * > Note that, on top of all of the above, this will only fire when `direction` is 1.
   */
  isLastBlock?: boolean;

  /** The starting row index of the items to fetch */
  fromRow: number;
  /** The ending row index of the items to fetch */
  toRow: number;
  /** The total amount of new items to fetch */
  offset: number;
  /**
   * The direction of scrolling.
   * Where 1 means scrolling down and -1 means scrolling up.
   */
  direction: -1 | 1;

}
```

In addition, there is an optional infinite scroll options object you can define which controls the behavior of the infinite scroll.

## Event Source

As with all triggers, the `eventSource` property indicates the source of the trigger.
In an infinite scroll datasource the first trigger will always be `data`.

The infinite scroll datasource adds a new event source type called **infiniteScroll**.
It will fire when the grid reach an area with empty rows and it needs to get the rows from the server.
It will then trigger an event with the `eventSource` being `infiniteScroll`.

## Custom Triggers

The classic custom triggers filter, sort and pagination behave differently when used in an infinite scroll data source.

First, there is no filter, sort or pagination done by the client, all custom triggers requires server interaction.
If you don't register for a custom trigger it is simply ignored.

If you do register, it will trigger an event as before with the `eventSource` property set to `customTrigger`.

<div pbl-example-view="pbl-custom-triggers-example"></div>
