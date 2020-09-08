---
title: Extending NGrid
path: extending-ngrid
tooltip: Walk-through of NGrid's extension model
type: topMenuSection
tags: plugin,extension,extensibility
ordinal: 4
---
# NGrid's Extensibility Model

One of the core architecture goals in NGrid is extensibility.  
Extensions (i.e. plugins) are the powerful engine that allows adding
features on-demand without overloading the core of the grid in terms of code complexity & maintenance and in terms pf core performance.

For this reason, NGrid is pre-packed with dedicated services aimed at helping extensions communicate with the grid and easily integrate
with columns, data and other internal features of the grid.

A plugin will add / extend:

- Logical behavior (e.g. copy/pase, persisting grid state, etc...)
- UI (e.g. Selection cell, detail-row, context menu, etc...)
- Both...

## Built-In Plugins

A lot of the features offered by the core package (`@pebula/ngrid`) are plugins.

You can easily identify built-in plugins through their import namespace, which is a secondary namespace to `@pebula/ngrid`.

Some examples:

- `@pebula/ngrid/target-events` - Support for input device events
- `@pebula/ngrid/detail-row` - Support for master / detail row structure
- `@pebula/ngrid/drag` - Support for drag and drop
- `@pebula/ngrid/state` - Saving and restoring state from and to the grid
- And more...

The rule of thumb is to prefer built in plugins over internal implementation when introducing new features.

For example, the virtual scrolling is heavily bound to the grid's behavior so it is an internal feature but
saving and restoring grid state (`@pebula/ngrid/state`) is not.

## Extensibility APIs

There are 3 main APIs that plugins can work with:

### Grid Plugin API (`PblNgridPluginController`)

A plugin manager unit (per grid instance) that:

- Provide access to `PblNgridExtensionApi`
- Provide access to grid events
- Provide inter-plugin communication. Accessing instances or other plugins and/or creating instances of other plugins.

Plugins will usually work with `PblNgridExtensionApi` but might use `PblNgridPluginController` to communicate with other plugins (e.g. when a plugin depends on another plugin).

### Grid Extension API (`PblNgridExtensionApi`)

The grid extension API is a set of APIs the control the grid, can invoke actions and update values.

You can get `PblNgridExtensionApi` through DI using the token `EXT_API_TOKEN` or through `PblNgridPluginController.extApi`.

### Grid Events

The Grid events are a stream of life-cycle events fired by the grid, which plugins can use in order to react and create behaviors.  
The events can be accessed through: `PblNgridExtensionApi.events` or `PblNgridPluginController.events`.

Here are some of the events:

- **beforeInvalidateHeaders** - Emits before the columns are processed. (Fired at startup and every time the columns are invalidated )
- **onInvalidateHeaders** - Emits after the columns are processed. (Fired at startup and every time the columns are invalidated )
- **onInit** - Emits once, when the grid's `ngAfterViewInit` is processed but after column invalidation.
- **onResizeRow** - Emits after a column resize was detected
- **onDataSource** - Emits when the datasource is replaced (not when the data changes by the trigger, only when the datasource itself changes)
- **onDestroy**  - Emits once, when the grid's `ngOnDestroy` is processed.

W> If you're building a plugin and find that an event is missing, please open an issue with a suggestion and we will try to add the event.

#### Grid Created Event

There is a special event that emits every time a new grid instance is created, this event is not part of the event stream because
the stream represents the events of a given instance. Think of it as a static event that notify about new grids. To access the stream
use `PblNgridPluginController.created`. (demo below)

## Creating a Plugin

There 2 ways to create a plugin and bind the plugin instance and a grid instance:

- Angular Directives
- Grid Extension Registry

The main difference between the 2 is the way the plugin instantiate and bind with the grid instance.  
With a **directive** the process is driven by the template, when the directive is set on the template, the plugin will bind to the grid and run.
Otherwise, registration is programmatic, driven by other (dependant) plugins or through grid instantiation events.

Other then that, both approaches are similar so we will now review each way and after that move to real plugin business.

### Angular Directives

By itself, an angular directive is the perfect plugin host, allowing immediate access to the grid instance and any other DI tokens available to it (i.e. `PblNgridExtensionApi` & `PblNgridPluginController`).

```typescript
export const PLUGIN_KEY: 'myCustomPlugin' = 'myCustomPlugin';

@Directive({ selector: 'pbl-ngrid[myCustomPlugin]', exportAs: 'myCustomPlugin' })
export class MyCustomPlugin {
  constructor(private grid: PblNgridComponent, private pluginCtrl: PblNgridPluginController) {
  }
}
```

To use it:

```html
<pbl-ngrid myCustomPlugin></pbl-ngrid>
```

Since it's an angular directive it can also get input, emit output, exportAs and get queried by angular (`ViewChild`).

I> The `PLUGIN_KEY` is a unique identifier used to register the plugin together with `ngridPlugin()`. This is not mandatory, directive style plugin
does not require registration as it is template driven and created by the angular runtime. However, registration provide better control and inter-plugin communication.

### Grid Extension Registry

Some plugins are not suitable for the template driven approach, for example we might want to apply them
for all of the grids instead of forcing the user to write them every time a grid is used.

This method provide an alternative path for instantiating plugins and binding them to grids.

We will use the same example:

```typescript
export const PLUGIN_KEY: 'myCustomPlugin' = 'myCustomPlugin';

export class MyCustomPlugin { }
```

There are 2 issues now:

1. How can we access the grid instance, `PblNgridExtensionApi`, `PblNgridPluginController` and other injectables?
2. How do we instantiate and bind the plugin to a grid instance?

With a directive it was all simple, everything was managed by angular:

1. We got access to the grid and other injectables through angular's DI.
2. Angular instantiated the plugin and created the bind to the grid.

We now need a way to be able to instantiate a plugin and pass it the grid instance and other injectables but it must be
consistent and work for all plugins.

We need to refactor our code:

```typescript
// id (PLUGIN_KEY) is unique and typed so we must augment it:
declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    clipboard?: PblNgridClipboardPlugin;
  }
  interface PblNgridPluginExtensionFactories {
    clipboard: keyof typeof PblNgridClipboardPlugin;
  }
}

export const PLUGIN_KEY: 'myCustomPlugin' = 'myCustomPlugin';

export class MyCustomPlugin {
  static create(grid: PblNgridComponent, injector: Injector): MyCustomPlugin {
    const pluginCtrl = PblNgridPluginController.find(grid);
    return new PblNgridTargetEventsPlugin<T>(grid, pluginCtrl);
  }

  constructor(private grid: PblNgridComponent, private pluginCtrl: PblNgridPluginController) { }
}

@NgModule()
export class MyCustomPluginModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY, factory: 'create' }, MyCustomPlugin);
}

```

Let's explain:

We added another metadata property to `ngridPlugin()` called `factory`. `factory` is the name of a **static** function on out plugin class
that we can use as a factory for creating new instances of the plugin.

The factory method must accept 2 parameters, the grid and an angular `Injector` and in it can create a new instance and return it.

Depending on the plugin's need we can get access to all sorts of things.  
We did not make use of the `Injector` in this case, but you can use it to get everything available in the DI tree.

I> Note that directive plugins can also use the extension registry, in fact this is the recommended approach so they are visible to other plugins.

I> The plugin key must be unique and typed (via augmentation).

## Example: `Copy To Clipboard` Plugin

Copy to clipboard allows copying the current selected cell/s into the clipboard.

This is a simple plugin that demonstrates:

- Dual plugin creation (Directive and Registry)
- Interacting with other plugins
- Creating a new grid default settings entry
- Supporting a auto mode which automatically apply the plugin on all grids.
- Working with the `ContextApi`

I> We will be using the `Clipboard` service from `@angular/cdk/clipboard` to handle the copy operation for us.

### Creating a unique key

First, we need a unique id/key/name for our plugin so it can be registered and accessed.  
To enforce uniqueness, the key is typed and can not be used if not present in the type system.  

To add a new key to the type system we will use typescript's augmentation feature:

```typescript
declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    clipboard?: PblNgridClipboardPlugin;
  }
}
```

### Creating the plugin class

Because this is a simple example, we will use the same class for the plugin and directive, you can split them in more complex scenarios.

```typescript
@Directive({ selector: 'pbl-ngrid[clipboard]', exportAs: 'pblNgridClipboard' })
@UnRx()
export class PblNgridClipboardPlugin implements OnDestroy {

  static create(grid: PblNgridComponent, injector: Injector): PblNgridClipboardPlugin {
    const pluginCtrl = PblNgridPluginController.find(grid);
    return new PblNgridClipboardPlugin(grid, injector, pluginCtrl);
  }

  constructor(public grid: PblNgridComponent<any>, protected injector: Injector, protected pluginCtrl: PblNgridPluginController) {
  }

  ngOnDestroy(): void {

  }
}

@NgModule()
export class MyCustomPluginModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY, factory: 'create' }, PblNgridClipboardPlugin);
}

```

Quite simple, a factory method called `create` that will create new instances for us.

I> We register our plugins in a static method inside the module, this is done to allow proper compilation of the library without tree-shaking the
registration code. This is probably not mandatory in your application.

### Adding business

Our plugin is ready to work but it does nothing, let's spice it up.

```typescript
  constructor(public grid: PblNgridComponent<any>, protected injector: Injector, protected pluginCtrl: PblNgridPluginController) {
    this.clipboard = injector.get(Clipboard);
    this.init();
  }
```

In the constructor we use the injector to get the `Clipboard` service, which we will use to set value into the clipboard.  
Next, we call the `init()` method:

```typescript
  private init(): void {
    this._removePlugin = this.pluginCtrl.setPlugin(PLUGIN_KEY, this);

    if (!this.pluginCtrl.hasPlugin('targetEvents')) {
      this.pluginCtrl.createPlugin('targetEvents');
    }

    const targetEvents = this.pluginCtrl.getPlugin('targetEvents');
    targetEvents.keyDown
      .pipe(UnRx(this))
      .subscribe( event => this.checkCopy(event) );
  }
```

In `init()` we:

- Register the plugin, so it can be accessed from other plugins.
- Checking if the `target-events` plugin is present, if not we create it because we need it to listen to input device events.
- We use the `target-events` plugin instance to listen to key-down events and handle them

The method `checkCopy()` contains logic for the copy detection, collection the data from the cells and sending it to the clipboard.

Last thing to remember is to un-register the plugin un destruction:

```typescript
  ngOnDestroy(): void {
    this._removePlugin(this.grid);
  }
```

That's it, the plugin is ready. To be used as directive we need to add a module declaring and exporting it.

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridModule, PblNgridConfigService, PblNgridPluginController } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

@NgModule({
  imports: [ CommonModule, PblNgridModule, PblNgridTargetEventsModule ],
  declarations: [ PblNgridClipboardPlugin ],
  exports: [ PblNgridClipboardPlugin ],
})
export class PblNgridClipboardPluginModule { }
```

And, be-hold, a copy functionality:

```html
<pbl-ngrid [dataSource]="ds" [columns]="columns" clipboard focusMode="cell"></pbl-ngrid>
```

### Auto Enable

Our clipboard plugin works, but it will only work when we apply it on the template.  
Copy to clipboard is a basic feature, how would we enable it on all grids?

The answer is using the grid created event, which fires every time a new grid instance is created.

```typescript
import { first, filter } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridModule, PblNgridConfigService, PblNgridPluginController } from '@pebula/ngrid';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import { PLUGIN_KEY, PblNgridClipboardPlugin } from './clipboard.plugin';

@NgModule({
  imports: [ CommonModule, PblNgridModule, PblNgridTargetEventsModule ],
  declarations: [ PblNgridClipboardPlugin ],
  exports: [ PblNgridClipboardPlugin ],
})
export class PblNgridClipboardPluginModule {
  constructor() {
    PblNgridPluginController.created
      .subscribe( event => {
        const pluginCtrl = event.controller;
        pluginCtrl.events
          .pipe(
            filter( e => e.kind === 'onInit' ),
            first(),
          )
          .subscribe( e => {
            if (!pluginCtrl.hasPlugin(PLUGIN_KEY)) {
              pluginCtrl.createPlugin(PLUGIN_KEY);
            }
          });
      });
  }
}
```

We subscribed to `PblNgridPluginController.created` to get notifications when a new grid is created.  
The event contains the plugin controller for the grid, with which we start listening to the `onInit` event.  
When `onInit` fires, we check if our plugin is registered, if not, we register it.

W> We check if the plugin is already registered because it might be, if the user also applied the directive.

### Input From User Defined Settings

Our auto-enable feature works, but it has some issues:

1. It will run every time angular creates an instance, creating multiple handlers
2. It is not configurable, the user can't turn it on or off.

To solve the 1st issue, we will simply apply some guards to make sure we only run once, something like this:

```typescript
  constructor(@Optional() @SkipSelf() parentModule: PblNgridClipboardPluginModule) {

    if (parentModule) {
      return;
    }
    // register here
  }
```

To solve the 2st issue, we will make use if the [Global Settings](../features/grid/global-settings).  
We will add a new settings group, specific to our plugin, allowing the user to toggle the feature.

The first step is enrich the global settings type with the new settings:

```typescript
declare module '@pebula/ngrid/lib/grid/services/config' {
  interface PblNgridConfig {
    clipboard?: {
      /** When set to true will enable the clipboard plugin on all grid instances by default. */
      autoEnable?: boolean;
    };
  }
}
```

Now, using the injected `PblNgridConfigService` we can determine the toggle state:

```typescript
export class PblNgridClipboardPluginModule {
  constructor(@Optional() @SkipSelf() parentModule: PblNgridClipboardPluginModule,
              configService: PblNgridConfigService) {

    if (parentModule) {
      return;
    }

    PblNgridPluginController.created
      .subscribe( event => {
        const config = configService.get(PLUGIN_KEY);
        if (config && config.autoEnable === true) { // checking the toggle state of the autoEnable feature
          const pluginCtrl = event.controller;
          pluginCtrl.events
            .pipe(
              filter( e => e.kind === 'onInit' ),
              first(),
            )
            .subscribe( e => {
              if (!pluginCtrl.hasPlugin(PLUGIN_KEY)) {
                pluginCtrl.createPlugin(PLUGIN_KEY);
              }
            });
        }
      });
  }
}
```

The user will define this in the application root module:

```typescript
@NgModule({ /** Module definition here... */ })
export class MyRootModule {

  constructor(gridConfig: PblNgridConfigService) {
    gridConfig.set('clipboard', {
      autoEnable: true
    });

  }
}
```

---

To see the final source code for this plugin, [see the github folder](https://github.com/shlomiassaf/ngrid/tree/master/libs/ngrid/clipboard/src/lib)

---

<div pbl-example-view="pbl-copy-selection-example"></div>
