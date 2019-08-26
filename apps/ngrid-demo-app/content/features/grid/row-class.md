---
title: Row Class
path: features/grid/row-class
parent: features/grid
ordinal: 1
---
# Row Class

**NGrid** allows full control and customization for grid **cells** but there are scenarios you will want to customize the row containing the cells.

The data rows in **NGrid** are generated internally by the grid but you can customize the CSS on per-row basis.  
For that, you need to provide a function that accepts the row's context (`PblNgridContext<T>`) and returns any valid value
that `[NgClass]` accepts.

The function is provided to the grid as an input, below is the signature with all related inputs:

```typescript
@Component({ /* ... */})
export class PblNgridComponent<T = any> {

  @Input() rowClassUpdate: undefined | ( (context: PblNgridRowContext<T>) => ( string | string[] | Set<string> | { [klass: string]: any } ));
  @Input() rowClassUpdateFreq: 'item' | 'ngDoCheck' | 'none' = 'item';

}
```

I> All data row elements already contain the css class `pbl-ngrid-row`

<div pbl-example-view="pbl-row-class-example"></div>

In the example above, all rows with value of the `name` property that has a length greater then 14, will get a red background.

## Update Frequency (`rowClassUpdateFreq`)

I> The following section is for advanced use cases which should be rare.

To minimize possible impact on performance the update frequency of the row's class is controlled and can be one of the following:

- **item** - Update only when the data-item for the row changes (*this if the default behavior*)
- **ngDoCheck** - Update on every change detection check that angular initiate's
- **none** - Don't update the row's class

The default behavior is **item** which means that the class list will update only when the data item changes.
This behavior fits well when the row's change but the data in them does not, which is 95% of the scenarios.

W> If you opt-in to `ngDoCheck`, make sure your update functions are light and does not perform complex computations.

You might have noticed the `none` frequency which **freezes** class updates of the row.  
It can be used in scenarios where the next update is known so you can freeze all updates until that point.

For example, let's assume we have an updater function that just returned the class `xyz` to a row (frequency is `item`).
The row element will now contain the class `xyz`.

If, at this point, we change `rowClassUpdateFreq` to `none` it will leave the `xyz` class in-place till the end of times.

Now, changing frequency back to `item`... If we want to clear the class from the row element class list:

- We can set `rowClassUpdate` to `undefined`
- We can set `rowClassUpdate` to a noop updater function that always return an empty string

Both will work, with the 1st option disabling the feature entirely and the 2nd option just updating to the current state.

However, the 2nd option will also keep running in the change cycle, always returning an empty string... so now we can
freeze it by setting the frequency to `none`.

W> Setting `rowClassUpdate` to `undefined` will cause internal cleanup which has cost's when setup again. **Try to avoid toggling**
the row class list by setting `rowClassUpdate` to `undefined` and back again. Instead apply toggle with a noop updater along with the `none` frequency.
