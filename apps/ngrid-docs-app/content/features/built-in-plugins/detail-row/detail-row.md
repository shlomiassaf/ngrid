---
title: Detail Row
path: features/built-in-plugins/detail-row
parent: features/built-in-plugins
ordinal: 1
---
# Detail Row

---

The detail row plugin depends on the **[target-events](../target-events)** plugin.  
If the **[target-events](../target-events)** plugin is not initialized the detail row plugin will initialize it.

---

The detail row plugin enable the toggling of an additional row, right next to (after) a parent row.

The detail row will get access to the parent row's context but it can display anything.

## Toggle Event

A detail row can be toggled on/off (opened/close) programmatically or through mouse/keyboard events (using the `targetEvents` plugin).

When a row is toggled on/off the `toggleChange` event is fired, which provided an event handler with access to the row, toggle state and a switch `toggle()` method.

<div pbl-example-view="pbl-detail-row-example"></div>

## Custom parent

<div pbl-example-view="pbl-custom-parent-example"></div>

## exportAs

The detail row plugin instance is exported as `pblNgridDetailRow`.

```html
<pbl-ngrid detailRow #detailRowInstance="pblNgridDetailRow"></pbl-ngrid>
```

## Options

You can customize the behavior of the detail row:

### Single / Multi detail row mode

By default, you can open multiple detail rows, however, you can force a single detail row behavior that will
close any open row before opening the next one using the input `singleDetailRow`.

### Excluding toggle from cells

By default, a click anywhere on the row will trigger a detail row toggle, however, this might raise issues
when a cell/s on the row have button. You can exclude specific cell using the input `excludeToggleFrom`

<div pbl-example-view="pbl-single-and-exclude-mode-example"></div>

### Filtering detail rows

By default, all rows are enabled and can be clicked to view their detail row. Setting `detailRow` to false will disable all detail rows.

```html
<pbl-ngrid detailRow></pbl-ngrid>

// OR

<pbl-ngrid [detailRow]="true"></pbl-ngrid>
```

However, you can provide a predicate function to determine which rows can be enable and which can not, dynamically on a "per row" basis.

<div pbl-example-view="pbl-predicate-example"></div>

### Row updates

The `toggleChange` event fires when ever the row is toggled on/off rendering the detail row.

However, there is another scenario when the detail row requires an update/re-render, when the row is replaced.
For example, when using pagination and the user navigates to the next/previous set or when the rows per page size is changed.
It might also occur when the data is updated due to custom refresh calls on the datasource or any other scenario that might invoke a datasource update.

The default behavior is such case is to re-render the detail row with the data of the new row but you can control this behavior using the input `whenContextChange` with 3 options:

- **context**: use the context to determine if to open or close the detail row
- **ignore**: don't do anything, leave as is (for manual intervention)
- **close**: close the detail row
- **render**: re-render the row with the new context (default)

Usually, what you will want is **context** (the default) which will remember the last state of the row and open it based on it.

W> Note that for "context" to work you need to use a datasource in client side mode and it must have a primary/identity column (pIndex) or it will not be able to identify the rows.

<div pbl-example-view="pbl-multi-page-example"></div>

### Custom row updates

The 3 behaviors on row update might be enough but there are scenarios when it's not. For example, when the detail row displays data fetched from the server
specifically for a row, i.e. when a detail row is opened the row is used to fetch data from the server and display it.

In such scenario, the `render` behavior will not help, we need to use the `ignore` behavior along with the `toggledRowContextChange` event.

The `toggledRowContextChange` emits whenever the row context has changed while the row is toggled open.

I> `toggledRowContextChange` emits the save event handler emitted by `toggleChange`

## Detail Rows with Virtual Scroll

From the grid's perspective, dynamic rows open and close randomly, changing the total height of the grid's vertical scroll area.

When a row is opened, height is added when closed height is reduced. This requires special attention when used with virtual scroll.

This is why detail rows only works with dynamic virtual scroll (`vScrollDynamic`).

<div pbl-example-view="pbl-detail-row-virtual-scroll-example"></div>

### Detail Row with Virtual Scroll and Animations

Usually, we would like to have a nice slide up/down animation whenever the detail row is toggled.  
This is supported using the familiar angular animations or CSS animation.

The only extra thing required is to:

1. Notify the gird that you use animation in this detail row
1. Notify the grid when the animation ends
1. Disable animation when the toggle originated from a rendering operation

Let's review using a simple detail row template definition...

The component holding the template below will have the following animation annotation in it's component metadata:  

```typescript
animations: [
  trigger('detailExpand', [
    state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
    state('*', style({height: '*', visibility: 'visible'})),
    transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
],
```

And not the template:

```html
<div *pblNgridDetailRowDef="let row; animation as animation; hasAnimation: 'interaction'"
      class="pbl-detail-row"
      [@.disabled]="animation.fromRender" (@detailExpand.done)="animation.end()" [@detailExpand]>
  <h1>I Am A Detail Row</h1>
</div>
```

It's a simple slide UP/DOWN animation.

Let's break the template into pieces:

- We use `*pblNgridDetailRowDef` to declare that this is a detail row template
- We use the expression `let row; animation as animation; hasAnimation: 'interaction'` which means:
  - Set `row` as the variable holding the row's data (On the context's `$implicit` property)
  - Set `animation` as the variable holding the animation object provided by the context
  - Define the `hasAnimation` input on the directive to be `interaction`
- `[@.disabled]="animation.fromRender"` - Disable animation when the toggle originated from a rendering operation and not a user interaction (click, programmatic)
- `(@detailExpand.done)="animation.end()"` - When the animation is done, notify the grid.

> If you're not familiar with structural directive, we recommend ramping up on that.

In short, what we do here is defining a detail row template which we declare as having animations.  
We **disable** it whenever it is toggled due to a rendering operation which is a page change, row context switch etc...  
This is important because we don't want to animate in such scenarios.
And of course, we notify when an animation has ended so the grid will be able to run the proper logic.

If you're using CSS animation it will look something like this:

```html
<div *pblNgridDetailRowDef="let row; animation as animation; hasAnimation: 'interaction'"
     class="pbl-detail-row" [class.detail-row-disable-animation]="animation.fromRender"
     (animationend)="animation.end()">
  <h1>I Am A Detail Row</h1>
</div>
```

#### hasAnimation

We set `hasAnimation` to `interaction` which indicates that there are multiple values we can provide.

- `interaction`: If the toggle origin is from a user interaction (e.g. click) or a programmatic API then it **WILL NOT**
                 measure the height until `animation.end()` is called on the detail row context.
                 Otherwise, it will measure it immediately.  
                 A Non-Interaction origin can happen from scrolling out of view or changing the row's context due to virtual scroll updates.  
                 I.E: When `fromRender` is true, the grid will measure the height immediately, otherwise it will wait for you to call `animation.end()`

- `always`: Will always assume animation is running when toggling the detail row and WILL NOT measure the height
            until `animation.end()` is called on the detail row context.

If you are using animation, we strongly suggest to use `interaction` mode!

If you're not using the dynamic virtual scroll, your detail row does not have animation or your animation is not changing the height, you can just ignore
everything by not setting `hasAnimation` and not using the `animation` object from the context

```html
<div *pblNgridDetailRowDef="let row" class="pbl-detail-row">
    <h1>I Am A Detail Row</h1>
</div>
```

