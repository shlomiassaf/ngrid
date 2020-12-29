---
title: Column Header Menu
path: recipes/column-header-menu
parent: recipes
ordinal: 2
---
# Column Header Menu

The main column header row can be extended in 2 ways, using a template or using a component.

If you hover over the header row you will see a **resize** handler, this is provided by the `@pebula/drag` plugin and it is using a **template** extension to inject
the resizer internally.

If you click on the **name** column you will see it is sorted now, with a sort indicator presented. This is provided by the `@pebula/ngrid-material/sort` plugin
and it is using a **component** extension to inject the `MatSortHeader` component from `@angular/material/sort`.

I> You can inspect the code in these plugins to get a better idea how it works.

Using a **template** extension is recommended in most cases. If you define it as the content of the grid it will be applied only for that grid
otherwise it will be applied globally (the scope of the registry).

Using a **component** extension is recommended when you have a working component that you want to abstract, e.g. `MatSortHeader` is already built
so it makes sense using it as is.

For the purpose of this demo we will use a **template** extension because it require less boilerplate and less setup.

<div pbl-example-view="pbl-column-header-menu-example"></div>

Most of the code lives in the template (html) and there no use of the component for the menu itself or how it functions.

For a more complete solution it will probably be best to wrap the template inside a component and use that component inside grid's we want to have the menu in.
This way we can also pass parameters to the component before it generate and register the template.

The menu is pure UI, so it doesn't make sense to include a built in menu with the core package. A menu is planed in `@pebula/ngrid-material` that uses
material components.
