---
title: Empty Collection Template
path: features/grid/empty-collection-template
parent: features/grid
ordinal: 6
---
# Empty collection template

When the datasource does not contain items (length is 0) the table will show the empty collection template.

The template can be defined at any location using the structural directive **`*pblNgridNoDataRef`**

```html
<div *pblNgridNoDataRef class="pbl-ngrid-no-data">
  <span>No Results</span>
</div>
```

I> The Empty Collection Template is part of the registry, i.e. - Registry cascading rules apply.

<div pbl-example-view="pbl-empty-collection-template-example"></div>

<div pbl-example-view="pbl-asynchronous-empty-set-example"></div>

<div pbl-example-view="pbl-dynamic-set-example"></div>
