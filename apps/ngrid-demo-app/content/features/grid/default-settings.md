---
title: Global Settings
path: features/grid/global-settings
parent: features/grid
ordinal: 5
---
# Global Settings

The grid is configurable, either through `@Input` properties or directly through the grid instance. This is also valid for grid plugins (both built-in and third party).  
In most cases, all of the configurations comes with default settings, which you can override using the global settings.

The settings are split into groups, each group contains a collection of relevant settings within it's context.  
The grid itself has only **one** group, called `table`

I> Group names are strictly typed, to add a new group the type requires augmentation.

To access the global configuration we use the `PblNgridConfigService` service:

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

    gridConfig.set('YOUR GROUP NAME HERE', {
      /* Group specific configuration here... */
    });
  }
}

```

The `set` methods accepts 2 parameters, the 1st is the name of the settings group and the 2nd parameter is the settings object for that group.
The grid's core settings are under the `table` group name, other plugins might add additional groups

I> There is no need to define `PblNgridConfigService` in the providers, it is done by the grid's module.

I> For plugins, the plugin author is responsible for adding the support for default settings assignment, they might choose not to do it or allow partial settings to be applied.

## Additional Groups

The reason for grouping the settings is to allow extensions/plugins to accept global settings using the same method in the grid.

This will contribute to a single, agreed upon, way of defining and consuming settings throughout the grid's eco-system.

## Collisions

Some plugins might provide a global configuration option and a local, instance/directive level options.

If this is the case, it is up to the author of the plugin to determine which option value to use.

In all of **NGrid** APIs (including plugins) the more specific option wins, that is a global option
with a counterpart directive `@Input`, the directive input (if set) will be used.
