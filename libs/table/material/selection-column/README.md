# Selection implementation using Material checkbox

A Plugin for `neg-table` with a `Selection` impelementation using components from `@angular/material/checkbox`.

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
<neg-table matCheckboxSelection="selection"></neg-table>
```

**Using a component**
```html
<neg-table>
  <neg-table-checkbox name="selection"></neg-table-checkbox>
</neg-table>
```

