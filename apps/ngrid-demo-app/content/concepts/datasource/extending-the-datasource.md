---
title: Extending The Datasource
path: concepts/datasource/extending-the-datasource
parent: concepts/datasource
ordinal: 3
---
# Extending The Datasource

The default datasource factory and datasource implementation provided with **nGrid** will do the trick for most of the use cases.  
Sometimes, however, a custom approach is required.

This is where custom extensions of the datasource are in-place.

The actual structure of the datasource is split into 3 parts:

- `PblDataSource<T>`
- `PblDataSourceAdapter<T, TData>`

`PblDataSource<T>` handles all external APIs and the adapter implements the logic.

The 3rd part, the factory, binds the two together and exposes a simple API for us to use.

In addition, where needed, you can also extends the event object, `PblDataSourceTriggerChangedEvent` and add custom metadata and logic to it.

I> The event object provide metadata about the source and reason for the trigger but it might also include methods to interact and update 
the process.

For example, the default factory that comes with **nGrid** is bundled with an adapter that automatically handles sorting, filtering and pagination
(client side mode) but also contains logic that allow "outsourcing" selected operations to the user.

In server side mode opting to manually implement pagination will result in an event triggered every time the pagination changed
expecting a new source of data from the event handler.

I> The [Infinite Scroll](../../../features/grid/infinite-scroll) plugin is a good example of how to extend the datasource.
