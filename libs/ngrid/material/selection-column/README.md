# Selection implementation using Material checkbox

A Plugin for `pbl-ngrid` with a `Selection` impelementation using components from `@angular/material/checkbox`.

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
<pbl-ngrid matCheckboxSelection="selection"></pbl-ngrid>
```

**Using a component**
```html
<pbl-ngrid>
  <pbl-ngrid-checkbox name="selection"></pbl-ngrid-checkbox>
</pbl-ngrid>
```

