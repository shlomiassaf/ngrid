---
title: Column Transform
path: features/column/column-transform
parent: features/column
ordinal: 5
---
# Column Transform

A Column transform means taking a value of a cell and transforming (without mutating the raw data).

There are 2 ways to transform the data:

## Transform using a template

This is just cell templating:

```html
<div *pblNgridCellTypeDef="'numberTimes100'; value as value; row as row; col as col">
  {{ value * 100 }}
</div>
```

## Transform using a function

We transform by providing a transformation function to the `transform` property in the column definitions:

```typescript
export interface PblColumnDefinition extends PblBaseColumnDefinition {
  // ...

  /**
   * Optional transformer that control the value output from the combination of a column and a row.
   * The value returned from this transformer will be returned from `PblColumn.getValue`
   */
  transform?: (value: any, row?: any, col?: PblColumn) => any;
  // ...
}
```

Function parameters:

- **value** is the value of the cell your are transforming.
- **row** is the entire row.
- **col** is the `PblColumn` instance.

```typescript

const PERCENT_TO_INTEGER = (value: any) => value * 100;

const COLUMNS = columnFactory()
  .table(
    { prop: 'percent', transform: PERCENT_TO_INTEGER },
  )
  .build();
```

W> Never call `col.getValue(row)` from a `transform` function as it will loop indefinitely (read more below...)

## When to use

When transforming, choosing how might be confusing. Template transformation is surely the easiest option but the necessarily the best one:

- Templates are slower than functions
- Template composition is more difficult
- Templates only live in the renderer and can not be used elsewhere.

That is,

- Rendering a template is more costly than invoking a method
- In most cases a template might already exists for the cell that you would want to use, how will you combine the 2?
- Templates are UI only, for example, they will not effect exporting (e.g. excel) but `transform` functions will

Use templates for UI related transformation (e.g. formatting, image from string, etc...).

**As a general rule of thumb, if you can transform something using a function, use a function transformer and not a template transformer.**

## Understanding transform order

To render a cell template, the grid will first extract the value for the cell and provide it to the template.

For that it will use the column instance (**col**) and row instance (**row**) to get the value:

```typescript
const value = col.getValue(row);
```

It will take the value and pass it to the template, along with the column instance and the row instance.

`PblColumn.getValue` is, by the way, a public method that you can use if you have a column instance and a row object

W> Never call `PblColumn.getValue` inside a `transform` function!!!

Inside `PblColumn.getValue`, the grid will:

- Extract the value from the row using the property this column points to
- If a `transform` function is provided
  - Call the `transform` function with the extracted value, the column instance and row instance
  - Return the value return from the `transform` function
- Else, return the extracted value

So the order is first calling the `transform` function (if provided) and then rendering the cell template.

Because `PblColumn.getValue` is calling the `transform` function internally, providing the value, row and column,
it is possible to invoke `col.getValue(row)` again from within the `transform` function, which will cause
a recursive loop until an overflow exception is throw, **please avoid it**
