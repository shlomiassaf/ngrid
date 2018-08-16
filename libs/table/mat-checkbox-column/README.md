# Selection implementation using Material checkbox

A Plugin for `sg-table` with a `Selection` impelementation using components from `@angular/material/checkbox`.

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
<sg-table matCheckboxSelection="selection"></sg-table>
```

**Using a component**
```html
<sg-table>
  <sg-table-checkbox name="selection"></sg-table-checkbox>
</sg-table>
```

