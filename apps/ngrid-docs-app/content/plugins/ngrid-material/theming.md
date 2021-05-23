---
title: Material Theming
path: plugins/ngrid-material/theming
parent: plugins/ngrid-material
ordinal: 0
tags: theme,theming,material
---
# Material Theming

**nGrid's** theme system is almost identical to the theme system in `@angular/material`, however **it does not depend on it**.

However, if you're using `@angular/material` (and probably `@pebula/ngrid-material`), it is 100% compatible with a theme generated from `@angular/material`.

`@angular/material` comes with 4 prebuilt themes:

- deeppurple-amber.css
- indigo-pink.css
- pink-bluegrey.css
- purple-green.css

For each theme there is a corresponding theme in `@pebula/ngrid-material/themes`.

If you're using Angular CLI, this is as simple as including one line in your `styles.scss` file:

```scss
@use '@angular/material/prebuilt-themes/deeppurple-amber.css';
@use '@pebula/ngrid-material/themes/deeppurple-amber.css';
```

Alternatively, you can [add your chosen CSS file to the styles array of your project's angular.json file](https://angular.io/guide/workspace-config#styles-and-scripts-configuration) or just reference the file directly. This would look something like:

```html
<link href="node_modules/@angular/material/prebuilt-themes/indigo-pink.css" rel="stylesheet">
<link href="node_modules/@pebula/ngrid-material/themes/indigo-pink.css" rel="stylesheet">
```


## Customized Material Themes (SCSS)

Creating a <a href="https://material.angular.io/guide/theming" target="_blank">custom material theme</a> is quite similar to how
we create a custom **nGrid** theme (which is no surprise):

1. Create palettes from color schemas (primary, accent, warn)
2. Create a theme from the palettes using `mat.define-light-theme` or `mat.define-dark-theme`
3. Render the theme by including the mixin `mat.all-component-themes(`

> We assume the **mat** namespace defined (`@use '~@angular/material' as mat`)

Let's [recall](../../../concepts/theming/introduction#customized-themes-scss) the steps required for creating an **nGrid** theme:

1. Create a palette from a color schema
2. Create a theme from your palette using `ngrid.define-light-theme` or `ngrid.define-dark-theme`
3. Render the theme by including the mixin `ngrid.ngrid-theme`

> We assume the **ngrid** namespace defined (`@use '~@pebula/ngrid' as ngrid`)

When working with material we use the material tools to create a theme object and render the styles. (Step 3)  
We can use the same theme to render the **nGrid** theme!

The only thing required is to add missing definitions into the theme so it will work with `ngrid.ngrid-theme`.

Depending on your selection, `mat.define-light-theme` or `mat.define-dark-theme` you can use `ngrid.define-light-theme` or `ngrid.define-dark-theme` (respectively) to update the
missing definitions and create a new theme that you can send to `ngrid.ngrid-theme`.  
`ngrid.define-light-theme` and `ngrid.define-dark-theme` accept a palette **or a theme**!!

```scss
@use '~@angular/material' as mat;
@use '~@pebula/ngrid' as ngrid;
@use '~@pebula/ngrid-material' as ngrid-material;

$typography-config: mat.define-typography-config();
@include mat.core($typography-config);

// Creating pallets for our theme using 3 color schemas
$candy-app-primary: mat.define-palette(mat.$indigo-palette);
$candy-app-accent:  mat.define-palette(mat.$pink-palette, A200, A100, A400);
$candy-app-warn:    mat.define-palette(mat.$red-palette);

// Create the theme using the material theme creator:
$candy-app-theme:   mat.define-light-theme($candy-app-primary, $candy-app-accent, $candy-app-warn);

// Updating the theme to include ngrid definitions, it is still compatible with material!
$candy-app-theme: ngrid.define-light-theme($candy-app-theme);

@include mat.core($typography-config);
@include ngrid.ngrid-typography($typography-config);

// rendering the material styles
@include mat.all-component-themes($candy-app-theme);

// rendering the ngrid styles
@include ngrid.ngrid-theme($candy-app-theme);

// Note that we don't need to render pbl-ngrid-theme, it is done internally in pbl-ngrid-material-theme
```

You can view additional examples by looking at the <a href="https://github.com/shlomiassaf/ngrid/tree/303119a7278cec83da7d8bdd1b77953f33a5f5f9/libs/ngrid-material/src/themes/prebuilt" target="_blank">source code</a> used to create the pre-built CSS themes.

> Note that pre-built CSS themes are located in `@pebula/ngrid-material/themes` and the SCSS theming utilities are located in `@pebula/ngrid-material`
