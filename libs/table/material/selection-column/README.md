# Selection implementation using Material checkbox

A Plugin for `pbl-table` with a `Selection` impelementation using components from `@angular/material/checkbox`.

## Usage
There are 2 ways, both require an existing column definition:

```ts
  const COULMNS = columnFactory()
  .table(
    { prop: 'selection', width: '48px' },
  );
```

**Using a directive**
```html
<pbl-table matCheckboxSelection="selection"></pbl-table>
```

**Using a component**
```html
<pbl-table>
  <pbl-table-checkbox name="selection"></pbl-table-checkbox>
</pbl-table>
```

