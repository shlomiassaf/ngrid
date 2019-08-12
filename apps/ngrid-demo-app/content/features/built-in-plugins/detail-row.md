---
title: Detail Row
path: features/built-in-plugins/detail-row
parent: features/built-in-plugins
ordinal: 1
---
# Detail Row

I> Requires `@pebula/ngrid/target-event` plugin

W> Currently not compatible with virtual scroll, make sure virtual scroll is not enabling on the table when detail rows are used

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

- **ignore**: don't do anything, leave as is (for manual intervention)
- **close**: close the detail row
- **render**: re-render the row with the new context (default)

<div pbl-example-view="pbl-multi-page-example"></div>

### Custom row updates

The 3 behaviors on row update might be enough but there are scenarios when it's not. For example, when the detail row displays data fetched from the server
specifically for a row, i.e. when a detail row is opened the row is used to fetch data from the server and display it.

In such scenario, the `render` behavior will not help, we need to use the `ignore` behavior along with the `toggledRowContextChange` event.

The `toggledRowContextChange` emits whenever the row context has changed while the row is toggled open.

I> `toggledRowContextChange` emits the save event handler emitted by `toggleChange`
