---
title: Advanced Theming
path: concepts/theming/structure
parent: concepts/theming
ordinal: 1
tags: space,spacing,theme,theming
---
# Advanced Theming

**nGrid** is built with SCSS using tools provided by the [@angular/components](https://material.angular.io/guides) theme toolkit.  
It means that **nGrid** adopts the same system used by angular material to style components and to define and manage themes.

I> **nGrid** does not depend on angular material and does not implement the *Material Design* spec.  
The same theming system is used but not the same style!

A theme is created from SCSS utility functions and mixins which **nGrid** exposes for you to create custom themes.

There are 3 parts for every theme:

- Color Palette
- Spacing
- Typography

---

In Angular Material, a theme is created by composing multiple palettes. In particular, a theme consists of:

- A primary palette: colors most widely used across all screens and components.
- An accent palette: colors used for the floating action button and interactive elements.
- A warn palette: colors used to convey error state.
- A foreground palette: colors for text and icons.
- A background palette: colors used for element backgrounds.


---

**nGrid** extends this data structure by:

- Extending the `foreground` and `background` palette's with additional, **nGrid** related, definitions.
- Adding a 6th palette called `spacing` that defines the spacing of the grid (row height, cell margins, etc...)

> The `accent` and `warn` palettes are not used, they exist only for compatibility and can be ignored.

To create a custom theme:

1. Create a **palette** from a color schema
2. Create a **theme** from your palette using the functions `pbl-light-theme` or `pbl-dark-theme`
3. **Render** the theme by including the mixin `pbl-ngrid-theme`

A typical theme file will look something like this:

```scss
@use '@pebula/ngrid' as ngrid;

// 1. Create a palette from a color schema
// `ngrid.$blue-palett` is a predefined color palette provided by `@pebula/ngrid/theming`
$ngrid-palette: ngrid.define-palette(ngrid.$blue-palette);

// 2. Create a theme from your palette using `pbl-light-theme` or `pbl-dark-theme`
$pbl-ngrid-theme: ngrid.define-dark-theme($ngrid-palette);

// Definitions for the grid's typography, documented below...
@include ngrid.ngrid-typography();

// 3. Render the theme by including the mixin `pbl-ngrid-theme`
@include ngrid.ngrid-theme($pbl-ngrid-theme);
```

For more information visit the <a href="https://material.angular.io/guide/theming" target="_blank">Angular Material Theming</a> guide.

Now let's break it down:

## Color Schemas

In the example above we used the color schema `ngrid.$blue-palettee` to create a palette.  
`ngrid.$blue-palette` is a built in color schema in **nGrid**, the material package also comes with a lot of color schemas and you can also create your own.

A color schema is a set of color definitions composed form a baseline primary color and contrasts suitable for it.

You can define your own color schemas, for inspiration take a look at the schemas defined in the <a href="https://github.com/angular/components/blob/8139358926b9d486b7f271778752fd73b50970af/src/material/core/theming/_palette.scss#L39" target="_blank">angular material project</a>.  
To learn more about the color system visit the <a href="https://material.io/design/color" target="_blank">material design docs</a>

The palette created from `ngrid.define-palette($colorSchema)` is a set of categories colors we can create a theme with.

## Spacing

Spacing is usually implemented through different padding values, however in **nGrid** it is a bit different since padding are not responsible for all spacing definitions.

Spacing is made up of the following:

- **header-row-height**: The minium height of header rows
- **row-height**: The minium height of grid data rows
- **footer-row-height**: The minium height of footer rows
- **row-spacing**: The horizontal padding (left/right) of a row
- **cell-spacing**: The horizontal padding (left) of a cell

There are 3 predefined spacing themes:

```scss
$spacing-theme-defaults: (
  xs: (
    header-row-height: 28px,
    row-height: 28px,
    footer-row-height: 28px,
    row-spacing: 12px,
    cell-spacing: 6px,
  ),
  sm: (
    header-row-height: 32px,
    row-height: 32px,
    footer-row-height: 32px,
    row-spacing: 12px,
    cell-spacing: 6px,
  ),
  normal: (
    header-row-height: 56px,
    row-height: 48px,
    footer-row-height: 48px,
    row-spacing: 24px,
    cell-spacing: 12px,
  )
);
```

The **default** spacing setup defined when you call `ngrid.define-light-theme` or `ngrid.define-dark-theme`.

The additional configurations are not applied by default and you need to include them if you want to use them.  
This can be done using the mixin `ngrid.predefined-spacing` with your theme:

```scss
@include ngrid.predefined-spacing($pbl-ngrid-theme);
```

Now setting the class `grid-sm` or `grid-xs` on the grid host element (`<pbl-ngrid>`) will adjust the spacing accordingly.

I> All pre-defined CSS themes comes with `grid-sm` & `grid-xs` included!

<div pbl-example-view="pbl-spacing-example"></div>

W> Note that changing te spacing after the datasource initialized might cause virtual scroll miscalculations.

### Overriding the default spacing

You can create your own, customize spacing configuration.  
Take one of the spacing configuration and use it to create a new modified version, or create completely new spacing configuration.

Now use it to create a spacing class:

```scss
@use '~@pebula/ngrid' as ngrid;

$my-custom-spacing: (
  header-row-height: 28px,
  row-height: 28px,
  footer-row-height: 28px,
  row-spacing: 12px,
  cell-spacing: 6px,
);

pbl-ngrid.grid-custom-space {
  @include ngrid.spacing-theme(map-merge($theme, ( spacing: $my-custom-spacing )));
}
```

Now we can use `<pbl-ngrid class="grid-custom-space"></pbl-ngrid>` for a grid with custom spacing.


> You can also update the spcaing on the theme variable before rendering the main theme, which will render it as the default spacing.


## Typography

In addition to the theme, you can also control the typography of the grid.

**nGrid** adopts the same system used by angular material to define and manage a typography.

---

Angular Material defines typography as a way of arranging type to make text legible, readable, and appealing when displayed.

---

In simple words, with typography we define the font style for different element in the grid.

For example, defining the font family, size and weight for header cells.

Similar to themes, the definitions are set in a data structure.

For more information visit the <a href="https://material.angular.io/guide/typography" target="_blank">Angular Material Typography</a> guide.

## CSS3 Variables

Currently, **nGrid** does not support CSS3 variables.

This is a nice to have feature, tracked in the [following discussion](https://github.com/shlomiassaf/ngrid/discussions/136), hop in if you want to contribute.
