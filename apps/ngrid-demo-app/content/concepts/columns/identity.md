---
title: Identity Column
path: concepts/columns/identity
parent: concepts/columns
ordinal: 4
tags: primary index
---
# Identity Colum

The identity column refers to the property on the row/data-item that uniquely identify it.

For example:

```typescript
interface Person {
  licenceId: string;
  name: string;
  age: number;
}
```

In the object above, it's safe to assume that the `licenceId` is unique across all `Person` records so we can use it
as an identity index.

I> You can think of the identity column as the **primary index**

---

It is highly recommended to define the identity whenever possible.

---

## Defining the Identity

To define the identity column, set the `pIndex` property of the column definitions to `true`.

I> Make sure only one column is set as the identity column. When multiple columns are set as identity columns the last
column defined will be the identity column. (On dev environment a warning message will appear in the console)

When set, the identity column has a great impact on performance, especially when searching for row's in large data sets.

W> Note that some plugins/features might not work if the identity is not set.

## No Identity

In some data sets there is not identity and we can't uniquely identify rows by their content.

When this is the case, **NGrid** will use the row position (index) of each row to identify it.

## Row Identity Attributes

In the grid, each data row element is populated by 2 identity attributes: `row-id` and `row-key`

The `row-id` will show the position (index) of the row within the datasource.  
The `row-key` will show the value of the identity field for that row (if an identity field is defined, otherwise identical to `row-id`)

For example:

```html
<pbl-ngrid-row row-id="15" row-key="XXY32UM"></pbl-ngrid-row>
```

Where `15` is the position index of the row and `XXY32UM` is the value of the `licenceId` property.
