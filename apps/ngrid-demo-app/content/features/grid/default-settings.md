---
title: Default Settings
path: features/grid/default-settings
parent: features/grid
ordinal: 3
---
# Default Setting

The grid is configurable, either through `@Input` properties or directly through the grid instance. This is also valid for grid plugins (both built-in and third party).

In most cases, all of the configurations comes with default settings but you can define your own defaults as well.

To define a default configuration we use the `PblNgridConfigService` service:

```typescript
import { NgModule } from '@angular/core';
import { PblNgridConfigService } from '@pebula/ngrid';

@NgModule({ /** Module definition here... */ })
export class MyRootModule {

  constructor(gridConfig: PblNgridConfigService) {
    gridConfig.set('table', {
      showHeader: true,
      showFooter: true,
      noFiller: true,
    });

    // automatically enable target events plugin on all grids.
    // Eliminates the need to use the `[targetEvents]` directive.
    gridConfig.set('targetEvents', {
      autoEnable: true
    });

  }
}

```

The `set` methods accepts 2 parameters, the 1st is the name of the settings group and the 2nd parameter is the settings object for that group.

The grid's core settings are under the `table` group name, other plugins might add additional groups

I> There is no need to define `PblNgridConfigService` in the providers, it is done by the grid's module.

I> For plugins, the plugin author is responsible for adding the support for default settings assignment, they might choose not to do it or allow partial settings to be applied.
