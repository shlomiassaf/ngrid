---
title: Style & Theming
path: concepts/theming/introduction
parent: concepts/theming
ordinal: 0
---
# Style & Theming

**nGrid** is built using SCSS.

The core styles and themes are located in `@pebula/ngrid/themes` which exposes a basic CSS theme mandatory for **nGrid** to render properly, it comes in 2 flavours:

- default-light.css
- default-dark.css

If you're using Angular CLI & SCSS, this is as simple as including one line in your `styles.scss` file:

```scss
@import '@pebula/ngrid/themes/default-light.css';
```

Alternatively, you can [add your chosen CSS file to the styles array of your project's angular.json file](https://angular.io/guide/workspace-config#styles-and-scripts-configuration) or just reference the file directly. This would look something like:

```html
<link href="node_modules/@pebula/ngrid/themes/default-light.css" rel="stylesheet">
```

I> Most chances are you're using a custom UI plugin (e.g `@pebula/ngrid-material`).  
UI plugins usually offer additional pre-built themes, see the relevant plugin documentation for more details.

## Customized Themes (SCSS)

When you want more customization than a pre-built theme offers, you can create your own theme file.

To create a custom theme:

1. Create a palette from a color schema
2. Create a theme from your palette using `ngrid.define-light-theme` or `ngrid.define-dark-theme`
3. Render the theme by including the mixin `ngrid.ngrid-theme`

> We assume the **ngrid** namespace defined (`@use '~@pebula/ngrid' as ngrid`)

A typical theme file will look something like this:

```scss
@use '~@pebula/ngrid' as ngrid;

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

> Note that pre-built CSS themes are located in `@pebula/ngrid/themes` and the SCSS theming utilities are located in `@pebula/ngrid`

This is the most basic, straight forward setup.

There are more customizations available, such as spacing, typography, colors etc which we will discuss in the [Advanced Theming](../structure) section.

## Additional Predefined Themes

The pre-built themes provided with the core package are basic yet extendible through [Advanced Theming](../structure).

UI plugin extensions might also provide additional themes, based on the UI framework they extend.  
**nGrid** provides 2 UI plugin extensions that come with additional themes:

- [@pebula/ngrid-material](../../../plugins/ngrid-material/theming) - 4 *Material Design* themes and material design SCSS theming framework
- [@pebula/ngrid-bootstrap](../../../plugins/ngrid-bootstrap/theming) - Bootstrap themes and bootstrap SCSS theming framework

Other, 3rd party, extensions might offer them as well.
