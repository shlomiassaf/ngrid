---
title: The Registry
path: concepts/grid/the-registry
parent: concepts/grid
---
# The Registry

The registry is a store for templates.

## Why

Templates are reusable, a single template can be used across the app, defined once and stored for reuse.

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

## Registered types

At this point it's obvious that cell templates are used in the registry, but other types are also used.

There are 2 ways to store entries:

- Single
- Multi

Each registry must be of a certain `kind` which is used to identify it.

A single registry will only allow one entry for the kind at any time, replacing the previous one when a new one is set.  
A Multi registry will allow any number of entries, which are grouped by their `kind`.

For example, in the cell template domain we have 4 kinds:

- **headerCell** - Cell templates for the column header cell
- **tableCell** - Cell templates for the column cell
- **editorCell** - Cell templates for the column cell in edit mode
- **footerCell** - Cell templates for the column footer cell

Of course, all of the kinds are **multi**.

## Not only `TemplateRef`

Intuitively, you might think that the registry only hold entities that are pure templates (`TemplateRef`). This is not the case.

The entry type depends on the implementation of the `kind`, the registry have no knowledge of the entries it store, it only expects them to have a `kind`.
It only serves as a get/set store for registry entries.

The implementation for cell templates will only use `TemplateRef` entries but other implementations use `TemplateRef` and component based entries.
