---
title: Intro
path: concepts/datasource/triggers/what
parent: concepts/datasource/triggers
ordinal: 0
---

# Intro

The datasource requires an `onTrigger` handler that it will invoke when it needs to get data records for the grid.  
There are multiple reasons (**sources**) why the `onTrigger` handler is called...

The most basic reason is that we need data.  
This can be when the grid initialize and needs data or when used manually by calling the `refresh()` method which will trigger the `onTrigger` handler.

When this happen the source is called **data** and the event will include metadata indicating if it's the first **data** event
and the current and previous values provided with the **data** events

The other sources for triggering are:

- Pagination
- Sort
- Filter

Each is a unique source that comes with metadata stored on the event.

The event contains metadata about the source, some events might be triggered by multiple sources.
It will also contains the current state for each source which we might need to know.

For example, a pagination event was triggered on a datasource which is already filtered.  
The source for the trigger is pagination, we moved a page but when calling the server we will need to do
it in the context of our filter, we will need to know the subset (filter) of our data to get the next page from...
