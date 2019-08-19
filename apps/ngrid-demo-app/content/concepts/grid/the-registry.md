---
title: The Registry
path: concepts/grid/the-registry
parent: concepts/grid
ordinal: 2
---
# The Registry

The registry is a store for UI elements rendering instructions, from here on **entry / entries**.

I> Moving forward, when ever you see the word entry or entries and don't understand it just replace it with **template**.
A **template** is just one type entry but it makes it easier to understand.

## Why

Entries are reusable, a single entry can be used across the app, defined once and stored for reuse.

The most obvious example is the cell template:

```html
<pbl-ngrid>
  <div *pblNgridCellDef="'*'; value as value">{{ value }}</div>
</pbl-ngrid>
```

In the example above we define a template that will be used by the grid to render the content of a cell.

Now let's get more specific:

```html
<pbl-ngrid>
  <div *pblNgridCellTypeDef="'number'; value as value">{{ value | number:'1.0-2' }}</div>
  <div *pblNgridCellDef="'*'; value as value">{{ value }}</div>
</pbl-ngrid>
```

Now we also have a template for rendering cells which belong to a column that is of type `number`.

Now, if we want to create another grid in the same page or in another page we will have to re-define the template again.
This is a redundant, mundane and error prone, we can define it once and reuse it in all of the grid's.

This is why we need a registry, to save all the templates so they can be used across the application.

## Registry Slots

A registry slot (also referred to as `kind`) is a place in the registry that can store one (single) or more (multi) registry
entries which are used to render a UI element.

The slot has a kind, a unique name/id, which describes what is role of the UI element that should be rendered.

For example, the `tableCell` slot is a multi-entry slot that holds entries that will be rendered as **cell items** in the grid.  
The `headerCell` slot is a multi-entry slot that holds entries that will be rendered as **cell header items** in the grid.

NGrid comes with a pre-defined list of slots, ready to be defined by the developer, allowing the creation of a completely custom UI.

In addition, extensions/plugins can add their own slot opening for the user to define, which also allow custom UI implementations
for the plugin/extension.

For example, the `BlockUI` extension opens the single-entry slot `blocker` that holds the UI element to be rendered when the grids
is busy.

I> A slot can hold more then just the UI definition (e.g. template), it can also hold metadata required for rendering. For example the
`tableCell` slot contains the id or type of the column it belongs to.

### Strictly Typed Slots

The list of allowed slots is type-manged at design-time using Typescript's mapped type so adding a new slot definition will require interface augmentation.

The allowed slot `kind`s are the keys of `PblNgridSingleRegistryMap` for single-entry slots and `PblNgridMultiRegistryMap` for multi-entry slots.

## Single & Multi Entry Slots

A **single entry** slot can hold only one entry per registry level at a time, each new slot will overwrite the previous one.

A **multi entry** slot can hold a collection of slots. For example, a collection of cell templates each maps to a column in the grid.

I> Remember that the registry is just a simple storage, actual implementation of slot entries is up to the creator of the slot.
In theory, one could create a JSON slot that holds instruction on how to render a UI element and implement a renderer for that format.

Some examples, in the cell template domain we have 4 kinds:

- **headerCell** - Cell templates for the column header cell
- **tableCell** - Cell templates for the column cell
- **editorCell** - Cell templates for the column cell in edit mode
- **footerCell** - Cell templates for the column footer cell

Of course, all of the kinds are **multi**.

## Registry Hierarchy

The registry is made up of multiple sub-registry built in hierarchy similar to how dependency injection works in angular.

There are 2 things to remember:

- An application will have a single, root registry
- Each instance will have a unique registry instance

This means that each grid has an access to a unique registry that is connected to a parent registry.
The parent might be the root but might also be another registry which points to a parent, going up to the root.

When the grid wants to render a cell it will search for the template attached to the column of the cell.

For example, if the column is of type `number` it will search in the registry for a **type cell template** for the type `number.
The first lookup will be in the registry of the grid, if not found it will search the parent going up to the root.

This structure is very flexible:

```html
<div *pblNgridCellTypeDef="'number'">ABC</div>

<pbl-ngrid>
  <div *pblNgridCellTypeDef="'number'">123<div>
</pbl-ngrid>

<pbl-ngrid></pbl-ngrid>
```

The example above is the template of a component, which render 2 grid's.  
There are 2 type cell templates, an orphan one, outside of any grid (rendering `ABC`) and one inside a grid (rendering `123`).

The first grid:

- Search's for the type cell template for `number`
- Find's a match that will render `123`

The second grid:

- Search's for the type cell template for `number`
- No match found in the unique registry, will now search in the parent
- Find's a match that will render `ABC`

In the first grid we are overwriting the definition, only for this grid.

### Template lifetime

Each template registered in the registry is bound to the host it is defined in.

For templates defined in the content of the grid:

```html
<pbl-ngrid>
  <div *pblNgridCellTypeDef="'number'">123<div>
</pbl-ngrid>
```

Simple, once the grid is gone it's registry is gone and so all templates are gone.

In the previous example, we had a template defined in the component:

```html
<div *pblNgridCellTypeDef="'number'">ABC</div>
<pbl-ngrid></pbl-ngrid>
```

Now, the registry is not unique, it might be the root or some other registry we defined in between.  
However, when the component is destroyed the template is also destroyed and removed from the registry.

### Real global templates

To really leverage the power of the registry it is best to define all template close to the root component of your application.

This can be done by defining the templates on the root component itself or by defining them on a component used in the root template.

## Registry Entity Types

In all of the examples above we've demonstrated registry entries that are
registered and defined through templates.

However, there is another type of registry entity we can use, a **Component based entry**.

With **Template based entries** we are able to use the angular template syntax to quickly define and register them in the registry but
**Component based entries** require registration through runtime code.

I> You can logically compare the two with `*ngTemplateOutlet` and `*ngComponentOutlet`.

### Template Based Registry Entries

```html
<div *pblNgridCellDef="'name'">ABC</div>
```

In the example above, `*pblNgridCellDef` is a <a href="https://angular.io/guide/structural-directives" target="_blank">structural directive</a> that automatically register the template for us in the registry.

Or, in other words, in the html snippet above, `pblNgridCellDef` will extract the template:

```html
<ng-template>
  <div>ABC</div>
</ng-template>
```

And register it in the registry as a cell template (`tableCell`) for the column with the id `name`.

```typescript
registry.addMulti('tableCell', this);
```

Another example:

```html
<div *pblNgridHeaderCellDef="'name'; col as col;">{{col.label}}</div>
```

In the html snippet above, `pblNgridHeaderCellDef` will extract the template:

```html
<ng-template let-col="col">
  <div>{{col.label}}</div>
</ng-template>
```

And register it in the registry as a cell **header** template (`headerCell`) for the column with the id `name`.

```typescript
registry.addMulti('headerCell', this);
```

### Component Based Registry Entries

A component based entry is used for rendering UI elements based on angular components.  
It serves as a close unit for creating, rendering and updating the component it encapsulates.

Because it is a bit more complex to define, n most cases, the implementation and use of these entries are hidden from the end-user.

Component based entries are good in cases where the UI implementation already exists as a component or when the rendered content
should wrap (project content) an existing, already rendered content.

A good example is the `MatSort` component from the `@angular/material/sort` package.  
We would want to use it within a header cell, to wrap the cell and show the current sorting state while handling clicks to change the sort state.

`MatSort` is an already existing sorting solution, tested and working and it requires wrapping the cell's content, a perfect fit for a component based entry.

To see how it is implemented, see the code for `@pebula/ngrid-material/sort`.

W> The entity type of each slot is defined by the slot's creator. Most slots support template based entries, some support component based and some support **both**

## The Date Header Extensions Slot

This slot (kind: `dataHeaderExtensions`) is a unique slot for the main header cells which usually require the ability to extend with multiple UI elements.

We will explain through a use-cae, consider a cell header that is required to:

- Show the label
- Show a sorting indicator (asc/desc) toggle the sort state when clicked
- Implement column re-order on drag in it's center
- Implement column re-size on drag in it's right corner
- Show a context menu button that will open the context menu on click

This is a fairly complex requirement which we can implement by creating a cell template:

```html
<sort-component *pblNgridHeaderCellDef="'*'; col as col;">
  <drag-and-reorder></drag-and-reorder>
  <drag-and-resize></drag-and-resize>
  <span>{{ col.label }}</span>
  <context-menu-icon></context-menu-icon>
</sort-component>
```

Easy... but there is a problem, when we want a certain cell to have a more specific UI we will need to repeat the entire thing.  
Eventually, we end up with a single template and multiple copies spread around in our application, when refactor day comes - big problem.

`dataHeaderExtensions` to the rescue.

This slot accepts **both template & component based entries** and renders them based on the meta instruction.

First, the `headerCell` slot is rendered like it would normally render and then the rendered content is passed
on to the `dataHeaderExtensions` to be added to the rendered content of the extensions in the slot.

This allows separate definitions for the `headerCell` slot, changing based on the column being processed but after that
adding some content shared by all column.
