---
title: Reuse
path: features/grid/reuse
parent: features/grid
ordinal: 7
---
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

<div pbl-example-view="pbl-reuse-example"></div>

When we toggle, notice that we swap the entire datasource. We could have implemented the logic inside the `onTrigger` handler and keep a single datasource but it will not work.

When we swap a datasource the table will cleanup the context and all column related data and rebuilt it preventing ghost context living in the cache.

I> When a table gets destroyed (`ngOnDestroy`) the datasource attached to it (if attached) is disconnected and automatically disposed. This has 1 exception, the `keepAlive` configuration was enabled on the datasource.

W> When you swap the datasource it will also cause the previous datasource to disconnect, if `keepAlive` is `false` it will also dispose itself.
