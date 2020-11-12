---
title: Clipboard
path: features/built-in-plugins/clipboard
parent: features/built-in-plugins
ordinal: 2
tags: copy,paste,excel
---
# Clipboard

The clipboard plugin adds a *"Copy to Clipboard"* functionality to the grid by copying the current selected cell/s into the clipboard.

---

The clipboard plugin depends on the **[target-events](../target-events)** plugin.  
If the **[target-events](../target-events)** plugin is not initialized the clipboard plugin will initialize it.

---

The default behavior of the plugin is to copy the data in the selected cells into the clipboard when `CTRL + C` is pressed (`CMD + C` in OSX).

When multiple cells are selected, they are separated by the `TAB` character (`\t`).  
When multiple rows are selected, they are separated by the `NEW LINE` character (`\n`).

<!-- Taken from Extending NGrid -->
<div pbl-example-view="pbl-copy-selection-example"></div>

## Plugin Options

This plugin provides a global configuration group under the name `clipboard` and local per-instance configuration.

I> If you're unfamiliar with global configurations and configuration groups, [read about it here](../../../features/grid/global-settings)

### Cell & Row Separators

By default the cell separator is `TAB` and the row separator is `NEW LINE` but you can change this globally and/or locally.

```html
<pbl-ngrid clipboard clpCellSep="," clpRowSep="\n\n\n"></pbl-ngrid>
```

### Auto Enable

Automatically enabling the `clipboard` plugin for all grids is configured **only** through the configuration service.

The following example will use the global configuration service to auto-enable the plugin and define the separators.

```typescript
@NgModule({
  imports: [ PblNgridModule, PblNgridClipboardPluginModule ]
})
export class MyAppRootModule {
  constructor(config: PblNgridConfigService) {
    config.set('clipboard', {
      autoEnable: true,
      cellSeparator: ',',
      rowSeparator: '\n',
    });
  }
}
```

I> The clipboard plugin development process is used as a case-study in the [Extending NGrid](../../../extending-ngrid#example-copy-to-clipboard-plugin) how-to page.
