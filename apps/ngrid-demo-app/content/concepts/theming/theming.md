---
title: Theming
path: concepts/theming/introduction
parent: concepts/theming
---
# Theming

In *ngrid* a theme is a set of pre-defined styles that together define the look and feel of the grid.

Usually, A theme is the set of colors that will be applied on the grid but in **ngrid** there are additional styles that
determine other aspects of the grid such spacing definitions (height, margins, etc...).

Using a theme is mandatory as it contains the basic style instructions required to display the grid.

There are 2 ways to use a theme:

1. Using a pre-built theme
2. Define a custom theme

## Using a pre-built theme

**Ngrid** comes prepackaged with several pre-built theme **css** files. All you have to do is to include a single css file for **ngrid** in your app.

You can include a theme file directly into your application from `@pebula/ngrid/themes`.

Available pre-built themes:

- default-light.css
- default-dark.css

If you're using Angular CLI, this is as simple as including one line in your styles.css file:

```scss
@import '@pebula/ngrid/themes/default-light.css';
```

Alternatively, you can just reference the file directly. This would look something like:

```html
<link href="node_modules/@pebula/ngrid/themes/default-light.css" rel="stylesheet">
```

The actual path will depend on your server setup.

You can also concatenate the file with the rest of your application's css.

## Define a custom theme

When you want more customization than a pre-built theme offers, you can create your own theme file.

There are 2 configurable theme sections:

- Color & Spacing Palette
- Typography

**ngrid** adopts the same system used by angular material to define and manage themes.

---

In Angular Material, a theme is created by composing multiple palettes. In particular, a theme consists of:

- A primary palette: colors most widely used across all screens and components.
- An accent palette: colors used for the floating action button and interactive elements.
- A warn palette: colors used to convey error state.
- A foreground palette: colors for text and icons.
- A background palette: colors used for element backgrounds.

W> **Ngrid** does not depend on angular material and does not implement the *Material Design* spec. The same theming system is used but not the same style!

---

**Ngrid** extends this data structure by:

- Extending the `foreground` and `background` palette's with additional, ngrid related, definitions.
- Adding a 6th palette called `spacing` that defines the spacing of the grid (row height, cell margins, etc...)

I> In **ngrid** the `accent` and `warn` palettes are not used, they exist only for compatibility.

To create a custom theme:

1. Create a palette from a color schema
2. Create a theme from your palette using `pbl-light-theme` or `pbl-dark-theme`
3. Render the theme by including the mixin `pbl-ngrid-theme`

A typical theme file will look something like this:

```scss
@import '~@pebula/ngrid/theming';

// 1. Create a palette from a color schema
$ngrid-palette: pbl-palette($pbl-blue);

// 2. Create a theme from your palette using `pbl-light-theme` or `pbl-dark-theme`
$pbl-ngrid-theme: pbl-dark-theme($ngrid-palette);

// Definitions for the grid's typography, documented below...
@include pbl-ngrid-typography();

// 3. Render the theme by including the mixin `pbl-ngrid-theme`
@include pbl-ngrid-theme($pbl-ngrid-theme);
```

For more information visit the <a href="https://material.angular.io/guide/theming" target="_blank">Angular Material Themeing</a> guide.

### Color Schemas

In the example above we used the color schema `$pbl-blue` to create a palette, `$pbl-blue` is a built in color schema which explains how we use it.

I> A color schema is a set of color definitions, a main color and additional variants of the main color.

You can define your own color schemas, for inspiration take a look at the schemas defined in the <a href="https://github.com/angular/components/blob/8139358926b9d486b7f271778752fd73b50970af/src/material/core/theming/_palette.scss#L39" target="_blank">angular material project</a>.
To learn more about the color system visit the <a href="https://material.io/design/color" target="_blank">material design docs</a>

### Spacing

Spacing is visually similar to padding but it is defined differently.

This is the default spacing setup defined when you call `pbl-light-theme` or `pbl-dark-theme`:

```scss
$pbl-spacing-theme-default: (
  header-row-height: 56px,
  row-height: 48px,
  footer-row-height: 48px,
  row-spacing: 24px,
  cell-spacing: 12px,
);
```

- **header-row-height**: The minium height of header rows
- **row-height**: The minium height of grid data rows
- **footer-row-height**: The minium height of footer rows
- **row-spacing**: The horizontal padding (left/right) of a row
- **cell-spacing**: The horizontal padding (left) of a cell

There is another default spacing theme called `$pbl-spacing-theme-narrow`:

```scss
$pbl-spacing-theme-default: (
  header-row-height: 32px,
  row-height: 26px,
  footer-row-height: 32px,
  row-spacing: 24px,
  cell-spacing: 12px,
);
```

#### Overriding the default spacing

```scss
@import '~@pebula/ngrid/theming';

$ngrid-palette: pbl-palette($pbl-blue);
$pbl-ngrid-theme: pbl-dark-theme($ngrid-palette);

// After the theme is defined but before it is included (rendered)
$narrow-spacing: ( spacing: $pbl-spacing-theme-narrow );
$pbl-ngrid-theme: map-merge($pbl-ngrid-theme, $narrow-spacing);

@include pbl-ngrid-typography();
@include pbl-ngrid-theme($pbl-ngrid-theme);
```

W> Make sure you update the theme variable before including `pbl-ngrid-theme`.

#### Multiple Spacings

For multiple spacing definitions we need custom classes with specific spacing values.

For this we use the mixin `pbl-ngrid-spacing` that only renders the CSS code related to spacing

```scss
@import '~@pebula/ngrid/theming';

$ngrid-palette: pbl-palette($pbl-blue);
$pbl-ngrid-theme: pbl-dark-theme($ngrid-palette);

@include pbl-ngrid-typography();
@include pbl-ngrid-theme($pbl-ngrid-theme);

// After the theme is included (rendered):
$narrow-spacing: ( spacing: $pbl-spacing-theme-narrow );
pbl-ngrid.slim {
  @include pbl-ngrid-spacing(map-merge($pbl-shell-theme, $narrow-spacing));
}
```

Now we can use `<pbl-ngrid class="slim"></pbl-ngrid>` for a slim grid.

## Typography

In addition to the theme, you can also control the typography of the grid.

ngrid adopts the same system used by angular material to define and manage a typography.

---

Angular Material defines typography as a way of arranging type to make text legible, readable, and appealing when displayed.

---

In simple words, with typography we define the font style for different element in the grid.

For example, defining the font family, size and weight for header cells.

Similar to themes, the definitions are set in a data structure.

## Using with `@angular/material`

**Ngrid's** theme system is almost identical to the theme system in `@angular/material` but does not depend on it.

However, if you're using `@angular/material` (and probably `@pebula/ngrid-material`), it is 100% compatible with a theme generated from `@angular/material`.

### Using with a prebuilt material theme

Angular material comes with 4 prebuilt themes:

- deeppurple-amber.css
- indigo-pink.css
- pink-bluegrey.css
- purple-green.css

For each theme there is a corresponding theme in `@pebula/ngrid-material`.

If you're using Angular CLI, this is as simple as including one line in your styles.css file:

```scss
@import '@angular/material/prebuilt-themes/deeppurple-amber.css';
@import '@pebula/ngrid-material/themes/deeppurple-amber.css';
```

Alternatively, you can just reference the file directly. This would look something like:

```html
<link href="node_modules/@angular/material/prebuilt-themes/indigo-pink.css" rel="stylesheet">
<link href="node_modules/@pebula/ngrid-material/themes/indigo-pink.css" rel="stylesheet">
```

## Using with a custom material theme

Let's recall the steps required for creating a theme without using angular material:

1. Create a palette from a color schema
2. Create a theme from your palette using `pbl-light-theme` or `pbl-dark-theme`
3. Render the theme by including the mixin `pbl-ngrid-theme`

When working with material we use the material tools to create a theme. **ngrid** theme is compatible with a material theme so we can use the material theme with **ngrid**.

The only thing required is to push missing definitions into the theme so it will work with **ngrid**.

Luckily for us, `pbl-light-theme` and `pbl-dark-theme` which accept a palette and return a theme **can also** accept a theme and return a (new) theme, updated with all
the required definitions for **ngrid**.

```scss
@import '~@angular/material/theming';
@import '~@pebula/ngrid/theming';

@include mat-core();

// Creating a material theme
$candy-app-primary: mat-palette($mat-indigo);
$candy-app-accent:  mat-palette($mat-pink, A200, A100, A400);
$candy-app-warn:    mat-palette($mat-red);
$candy-app-theme: mat-light-theme($candy-app-primary, $candy-app-accent, $candy-app-warn);

// Updating the theme to include ngrid definitions
$candy-app-theme: pbl-light-theme($candy-app-theme);

// rendering the material theme
@include angular-material-theme($candy-app-theme);
// rendering the ngrid theme
@include pbl-ngrid-theme($candy-app-theme);
```
