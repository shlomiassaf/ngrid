---
title: Action Row
path: recipes/action-row
parent: recipes
ordinal: 0
---
# Action Row

Working with tables, we often find that we are using the same patterns.
For example, wildcard filtering, refreshing, adding rows and others...

Let's build an action row, a row with common commands that we can re-use across tables.

Our action row will be able to:

- Display a label for the table
- Display a filter input and filter the table
- Display a refresh button and refresh the table

Here is the final result:

<div pbl-example-view="pbl-action-row-example"></div>

We added the action row with this code:

```html
<my-grid-action-row filter label="My Table"></my-grid-action-row>
```

The functionality of the action row above is not important, it is customizable.
What's important is how it interacts with the table:

```typescript
  @ViewChild('actionRow', { read: TemplateRef }) actionRow: TemplateRef<any>;

  constructor(public grid: PblNgridComponent<any>) { }

  ngAfterViewInit(): void {
    this.grid.createView('beforeTable', this.actionRow);
  }
```

- We get a reference to the template so we can use it as our action row.
- In the constructor we get a reference to the table, we know it will get injected because we declare the component **inside** the table component.
- In `ngAfterViewInit` we register our action row, we register it in the `beforeTable` section, because we want it on top.

I> As we create views we can also remove them using `removeView`, hence we can also toggle action rows on and off.
