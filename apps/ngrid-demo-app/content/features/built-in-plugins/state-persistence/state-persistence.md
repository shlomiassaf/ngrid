---
title: State Persistence
path: features/built-in-plugins/state-persistence
parent: features/built-in-plugins
ordinal: 3
---
# State Persistence

The state persistence plugin allows saving and restoring state from and to the grid.

The obvious use case is saving and restoring user-modified data such as column width's, visual state and order. However, state is not limited
to columns only, anything configuration related can be saved and restored.

## Simple Usage

The state plugin is customizable so other plugins can use it and for it to be used in different environment.
The customization comes with a price, the more power needed the more complex it gets.

To get up and going easily the plugin comes with a predefined configuration that addresses the obvious use-case, saving and restoring user modified data.

```html
<pbl-ngrid id="statePersistenceDemo" persistState></pbl-ngrid>
```

By setting the attribute `persistState` on the grid it will automatically restore sate on initial load and save state when it is destroyed or resized.

The state is save to and restored from the local storage.

The state can be pretty big, not all it is saved, just a specific portion of it which is customizable through the options.
The `persistState` directive comes with pre-defined options that uses a preset called `userSessionPref` to defined which state to persist.

The `userSessionPref` preset persists:

- `hideColumns`, `showFooter`, and `showHeader` from the grid instance
- The order of the columns
- The width of the column

Note that the `id` attribute is assigned to the element, this is **mandatory** so the plugin can identify the grid when saving and restoring.

I> In this example the `id` attribute is used for identification, you can provide your own identification adapter and use other methods such as url, hash, etc...

I> In this example the local storage is used for persistence, you can provide your own persistence adapter and use other type of data stores for saving and restoring state.

<div pbl-example-view="pbl-state-persistence-example"></div>

I> Ok this was easy, just adding `persistState` and the users of the table can save and restore the preferences.

Now, change the width of the email column using the slider and / or swap the `name` and `rating` columns using the button.

**Navigate to a different page and back to this one, your changes was magically saved!**

### Persistence Events

The plugin (and the `persistState` directive) emit life-cycle events from the persistence process:

```ts
export class PblNgridStatePlugin {

  afterLoadState: Observable<void>;
  afterSaveState: Observable<void>;
  onError: Observable<{ phase: 'save' | 'load'; error: Error; }>;

}
```

In the example above we used the `afterLoadState` event to register the initial value for the slider.

---

And of course, don't forget to the the `PblNgridStatePluginModule` module to your project!

```ts
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';
```

## Plugin Options

This plugin provides a global configuration group under the name `state` and local per-instance configuration.

I> If you're unfamiliar with global configurations and configuration groups, [read about it here](../../../features/grid/global-settings)

### Auto Enable

Automatically enabling the `state` plugin for all grids is configured **only** through the configuration service.
In addition, you can define the load/save configuration to use when auto-enabling the plugin.

```typescript
interface PblNgridConfig {
  state?: {
    /** When set to true will enable the state plugin on all table instances by default. */
    autoEnable?: boolean;
    /**
     * Options to use when auto-loading the plugin
     */
    autoEnableOptions?: {
      loadOptions?: PblNgridStateLoadOptions;
      saveOptions?: PblNgridStateSaveOptions;
    }
  };
}
```

## Advanced Usage

The simple usage scenario is usually enough but there are use-cases where fine-tuning is required or even an
entirely different agenda is at play.

For example, we might want to fine-tune specific keys in the simple usage scenario, removing keys
that we don't want to allow the user to persist, e.g. the width of a column, it's order, etc...

We might want to save entire state so we can load it manually, we can go wild and merge multiple states
together based on group of grids, no limit here.

There are 2 ways to control the way state is saved and restored:

1. Provided different options
2. Extending the state (teaching the state how to save/restore new data)

### The Core

Before we dive in, let's overview the core constructs of the plugin.

The state plugin has 3 main functions:

```ts
export function hasState(grid: PblNgridComponent, options?: PblNgridStateOptions): Promise<boolean>;
export function saveState(grid: PblNgridComponent, options?: PblNgridStateSaveOptions): Promise<void>;
export function loadState(grid: PblNgridComponent, options?: PblNgridStateLoadOptions): Promise<PblNgridGlobalState>;
```

Which we can import:

```ts
import { hasState, saveState, loadState  } from '@pebula/ngrid/state';
```

With these 3 we can check if a grid `hasState`, if so `loadState` and later `saveState`.

All we need is an instance of the grid.

W> The options are optional, if not provided or partially provided the plugin will use internal default values.

The plugin (and the `persistState` directive) use these functions with some of the grid events to create a unit
of control for state persistence but you can also do it with these 3 functions.

Beside `hasState`, `saveState` and `loadState` the core provides the mechanism to save and restore state by splitting
it (the state) to chunks, starting with 0 chunks but allowing to register chunk handlers that can save and restore it.

The plugin comes with built in chunk handlers that are already registered.

### The Options

The options control the behavior of the plugin, how to save and restore state, how to identify a grid and what parts of the state to persist from the state
available through state chunk handlers (i.e. you can't add new handlers through the options).

There are 2 type of options, one for saving and one for loading:

```ts
export type PblNgridStateOptions = PblNgridStateLoadOptions | PblNgridStateSaveOptions
```

The options for saving (`PblNgridStateSaveOptions`) is a subset of loading (`PblNgridStateLoadOptions`):

```ts
export interface PblNgridStateSaveOptions {
  /**
   * The adapter to use for persistance.
   * @default PblNgridLocalStoragePersistAdapter
   */
  persistenceAdapter?: PblNgridPersistAdapter

  /**
   * The resolver used to get the unique id for an instance of the grid.
   * If not set default's to the id property of `PblNgridComponent` which is the id attribute of `<pbl-ngrid>`
   * @default PblNgridIdAttributeIdentResolver
   */
  identResolver?: PblNgridIdentResolver;

  /**
   * Instruction of chunk and chunk keys to include when serializing / deserializing.
   * Include is strict, only the included chunks and keys are used, everything else is ignored.
   *
   * If `include` and `exclude` are set, `include` wins.
   *
   * Note that when using include with child chunks you must include the root chunk of the child chunk, if not
   * the root chunk is skipped and so the child.
   *
   * For example, to include the `width` key of the `dataColumn` child chunk we must also include the `columns` root chunk.
   *
   * ```ts
   *   const obj: StateChunkKeyFilter = {
   *     columns: true,
   *     dataColumn: [
   *       'width',
   *     ]
   *   };
   * ```
   *
   * We can also use the wildcard `true` to include all items in a chunk:
   *
   * ```ts
   *   const obj: StateChunkKeyFilter = {
   *     columns: true,
   *     dataColumn: true,
   *   };
   * ```
   *
   * Same specificity rule apply here as well, `columns: true` alone will not include all of it's child chunks so we must add `dataColumn: true`.
   * Vice versa, `dataColumn: true` alone will not get included because it's parent (`columns`) is blocked
   */
  include?: StateChunkKeyFilter;

  /**
   * Instruction of chunk and chunk keys to exclude when serializing / deserializing.
   * Exclude is not strict, all known chunks and keys are used unless they are excluded and so will be ignored
   *
   * If `include` and `exclude` are set, `include` wins.
   *
   */
  exclude?: StateChunkKeyFilter;
}
```

Straight forward:

- **persistenceAdapter**  
  The persistence adapter to use for saving / restoring state. e.g: remote server, indexDb, localStorage, etc...
  The plugin comes with a default adapter that uses the local storage.

- **identResolver**  
  The adapter for uniquely identifying a grid. e.g.: An id property on the grid, url combination, hash, etc...
  The plugin comes with a default adapter that identifies a grid based on it's id property (the id attribute in the DOM)

- **include / exclude**  
  A map that filters out specific chunks and / or chunk keys.  
  When **include** is set, only the values filtered out by the map are used.  
  When **exclude** is set, all values are used except values filtered out by the map.  
  If both **include** and **exclude** are used, **include** winds and exclude is ignored.

#### Map filtering in depth

Filtering with **include / exclude** is very powerful but requires understand the **state chunks** system.

Let's start with a filter:

```ts
  const filter: StateChunkKeyFilter = {
    grid: [
      'hideColumns',
      'showFooter',
      'showHeader',
    ],
    columnOrder: true,
    columns: [ 'table' ],
    dataColumn: [
      'width',
    ]
  }
```

First, the output of the filter depends wether it is set in the `include` or `exclude` property of the options.

The filter is a map with the keys representing chunks (by their name) and the values represent what to include from the chunk.
The allowed values are boolean true/false or and array of string which are also keys, state keys.

I> Notice that some property can accept an array of keys, some can only accept boolean and some can accept both.

Starting with the **grid** chunk / property, we only specify 3 keys, the grid chunk itself has more keys on it's chunks:

`'showHeader', 'showFooter', 'focusMode', 'usePagination', 'hideColumns', 'minDataViewHeight'`

So if we set the filter in **include** the 3 keys are the only state we save for the grid chunk.  
If we set the filter to **exclude** we use all other keys **except** the 3.

I> The grid chunk represents state of primitive properties on the grid instance

I> The grid chunk can also be set to true which will include / exclude all keys

Now, the **columnOrder** chunk / property, here we set it to `true` which means all keys in the chunk, but not quite...
In fact, **columnOrder** can only be set to true/false because it has no keys, it's an array of column id's representing the order...

The remaining 2, **columns** and **dataColumn** and related.  

Up until this point we only worked on root chunks (grid and columnOrder), now we will also work with child chunk.

A **RootStateChunk** can have a single level of child chunks which he can run internally, in this example **columns** is the root and it has a child **dataColumn**.

The **columns** chunk represents the entire column definition set which means it has child chunks based on the column type handled.

We will not got into depth here, enough to say that in **include** mode we only save data columns and only their widths, all meta columns are ignored.

---

Did you notice that our filter is actually the `userSessionPref` preset? if set in the **include** property it will
only include a limited subset of the state, required for user preference persistence.

---

I> If you are worried about guessing chunk names and keys don't be, the entire `StateChunkKeyFilter` is fully typed.

## More to come

The state plugin API is solid but requires some work around advance usage agronomics.

The following is a partial list of what's to come:

- Adding more preset
- Simple API to merge presets and fine-tune options on the fly
- More events (before load/save)
- Easy integration with the `persistState` directive

## Extending the state

Extending the state is usually for plugin authors.

The entire plugin is based on built in extensions, visit the source code for the plugin, within the `core/built-in-handlers` for examples.
