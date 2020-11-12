---
title: Layout
path: concepts/grid/layout
parent: concepts/grid
ordinal: 0
---
# Grid Layout

The common layout for a grid is a collection of rows where each row shows a collection of cells.

In n**Grid**, the default behavior is having the first row showing the column names (label) in each cell and the following rows will display
the data provided from the datasource. There is also a footer row that is not rendered by default.  
To toggle the header and footer visibility state use the `showHeader` and `showFooter` inputs (respectively).

<div pbl-app-content-chunk="pbl-grid-layout-1" inputs='{ "section": 1 }'></div>

I> We call header / footer rows (and all of their derivatives) **meta rows**

## Advanced Layout

The class `Header / Data / Footer` layout is not always enough, we might also want to display other type of rows or even another type of layout other the a row.

For example, showing multiple header rows, a group row, a title row (action row), etc...  
Example for non row layouts can be pagination, menus or any other thing you can think of, not limited to the shape of a row.

In addition, **meta rows** can be placed in different layouts effecting how they interact with the data rows.

To support advance layouts the grid is split to 3 sections:

The layout is built from 3 sections:
<div style="display: flex">
  <ul style="flex: 1 1 auto">
    <li>Outer Top Section</li>
    <li>Inner Section</li>
    <li>Outer Bottom Section</li>
  </ul>

  <div style="flex: 1 1 auto">

```html
  <pbl-ngrid>
    Outer Top section
    Inner section
    Outer Bottom section
  </pbl-ngrid>
```
  
  </div>
</div>

I> The order of the list represents the layout (vertical) in which the sections are rendered.

The **Outer** sections display meta rows (header/footer) and custom components (i.e. projected content).  
The **Inner** section display meta rows and data rows.

I> Notice that all of the sections display meta rows, the `type` of the meta row (defined the user) will determine in which section the row will be rendered.

## Vertical layout of sections

The host element of the grid (`pbl-ngrid`) is the container of all of the sections abd the sections are renderer one after the other, vertically.

Each **Outer section** will occupy the height required for it to fully show.  
The **Inner section** will occupy the remaining height (i.e. it's passive, the height will be the container minus the height of the outer sections).

To illustrate, if a gird has a height of 1000px and both outer sections occupy 500px the inner section will have 500px available. If the height
of the inner section is 800px it will use a vertical scroll bar.

W> If the height of the outer sections is higher then the grid's height the grid will has a scroll bar, make sure you avoid this because you might
end up with 2 scroll bars!

## Meta rows

A meta row can be one of 3 types: **row**, **sticky** or **fixed**.

When a meta row's type is **fixed** it will be rendered in the respective **outer** section.  
When a meta row's type is **row** or **sticky** it will be rendered in the **inner** section, above (header) or below (footer) the data rows.

It is always more clear with an example:

<div pbl-app-content-chunk="pbl-grid-layout-1" inputs='{ "section": 2 }'></div>

I> The default `type` is **fixed**

I> **row** and **sticky** are rendered in the same place. **sticky** will stick to top edge when it goes out of view.

W> Avoid mixing different meta row types in the same table.

W> Using **sticky** with virtual scroll is not encouraged, if you really need to make sure you read the advanced section at the end.

> There is a lot more to meta rows, covered in depth in the [column model](../../columns/column-model). To understand how they interact with the
sections we only covered the <code>type</code> property of the meta row

## Custom components (Outer section)

The outer sections (top & bottom) render **fixed** meta rows but they also render custom components projected to them by the user.

This is done by providing a template and the outlet we want it to render.  
Templates can be added programmatically (`PblNgridComponent.createView()` API) or declaratively (`pblNgridOuterSection` structural directive).

**Outer Top Section** will render all templates **ABOVE** the fixed header rows (if any).  
**Outer Bottom Section** will render all templates **BELOW** the fixed header rows (if any).

In other words, fixed meta rows are always bound to the edge of the grid container.

I> The `pblNgridOuterSection` directive is a helper that uses the `PblNgridComponent.createView()` API internally to provide a declarative interface using templates.

<div pbl-app-content-chunk="pbl-grid-layout-1" inputs='{ "section": 3 }'></div>

The examples above all use the directive `*pblNgridOuterSection` in the same way:

```html
<pbl-ngrid class="meta-row-type-example" [dataSource]="ds" [columns]="columns">
  <div *pblNgridOuterSection="'top'">
    <h4>I'm an Outer Top Section</h4>
  </div>
  <div *pblNgridOuterSection="'bottom'">
    <h4>I'm an Outer Bottom Section</h4>
  </div>
</pbl-ngrid>
```

The only difference is between the `columns` definitions.

## Advanced: **Avoiding Sticky Rows**

The **sticky** type is a special case of the **row** type.
It is a core feature of `@angular/cdk` which uses the CSS property `position: sticky` to implement "stickiness".

Initially, both types are rendered the same but when a sticky row is scrolled out of view it will become "sticky" so it
will stick to the top or bottom of the table (header / footer rows respectively).

It works great when virtual scrolling is disabled but when enabled it can create flickering and sometimes unexpected behavior.
It was not design to work with virtual scrolling nor tested for it in the CDK.

The problem, in short, is that when using virtual scroll the positioning of the grid is controlled by the virtual scroll engine to simulate
the scroll bar and offset of the entire table but actually rendering a small subset of the rows.

This does not work well with `position: sticky` because it requires frequent updates of the absolute position (top) with a compensation of the offset. Without
virtual scroll it is always 0.

I> You can read more about sticky rows in the <a href="https://material.angular.io/components/table/overview#sticky-rows-and-columns" target="_blank">angular/components docs</a>

## Advanced: **Outer Bottom**

W> This is an advanced section is for plugin authors and users already familiar with n**Grid**

Let's start with some code:

<div style="display: flex; place-content: center space-between; align-items: center">
  <div style="flex: 1 1 100%; max-width: 45%">

```html
<pbl-ngrid>
  <h4>This content is projected!!!</h4>
</pbl-ngrid>
```

  </div>
  <div style="flex: 1 1 100%; max-width: 45%">
    <div pbl-app-content-chunk="pbl-grid-layout-1" inputs='{ "section": 4 }'></div>
  </div>
</div>

OK, we can also use angular's content projection to project custom templates.

So why do we need `*pblNgridOuterSection="'bottom'"`?

<div style="display: flex; place-content: center space-between; align-items: center">
  <div style="flex: 1 1 100%; max-width: 45%">

```html
<pbl-ngrid>
  <h4>This content is projected!!!</h4>
  <div *pblNgridOuterSection="'bottom'">
    <h4>I'm an Outer Bottom Section</h4>
  </div>
</pbl-ngrid>
```

  </div>
  <div style="flex: 1 1 100%; max-width: 45%">
    <div pbl-app-content-chunk="pbl-grid-layout-1" inputs='{ "section": 5 }'></div>
  </div>
</div>

Got it! using `*pblNgridOuterSection="'bottom'"` will render it **BEFORE** any user projected content!

But wait, what about projecting it **AFTER** user projected content?

The directive `*pblNgridOuterSection` is using the `PblNgridComponent.createView()` API under the hood and simplify the task of custom projection.

When developing a plugin, it is sometimes important to explicitly define the position of a custom template as the user can always project his custom content.

Let's summarize where custom templates can project to:

| Project Location | Declarative API                     | Imperative API                       |
|------------------|-------------------------------------|--------------------------------------|
| Top              | `*pblNgridOuterSection="'top'"`     | `createView()` API                   |
| Bottom - Before  | `*pblNgridOuterSection="'bottom'"`  | `createView()` API                   |
| Bottom - Content | Angular content projection          | Not Available                        |
| Bottom - After   | Not Available                       | `createView()` API                   |

The `PblNgridComponent.createView()` API can project into the following locations:

- Top: `ngridInstance.createView('beforeTable', templateRef);`
- Before Content: `ngridInstance.createView('beforeContent', templateRef);`
- After Content: `ngridInstance.createView('afterContent', templateRef);`

If you're a plugin author and this find details positioning is important, using the imperative API.  
If you're a developer and an element you're trying to project is showing before or after an element
from a plugin you're using, use the imperative API.

You can read more on the programmatic approach, using the API in the [action-row story](../../../stories/action-row).
