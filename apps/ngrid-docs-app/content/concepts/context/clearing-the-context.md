---
title: Clearing The Context
path: concepts/context/clearing-the-context
parent: concepts/context
tags: context, contextApi
ordinal: 2
---
## Clearing The Context

Clearing the context means wiping out all existing state about rows and cells and creating a new, fresh and clean context.

## Why

## When

## How

## Automatic Context Clearing

The grid will automatically clear the context when:

- A new data source is provided (i.e. the value bound to `[ds]` is changed)
- A new column definition set is provided (i.e. the value bound to `[columns]` is changed), or when `invalidateColumns()` is called explicitly.
- When the datasource emits `onRenderDataChanging` and there is not identity column set (`pIndex: true`)  
This is common for server side filtering/sorting/pagination. If an identity column exists the cache will persist between data fetching calls.
To clear the cache either replace the data source or use the `ContextApi` to clear it manually.
