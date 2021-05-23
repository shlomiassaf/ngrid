---
title: Bootstrap Theming
path: plugins/ngrid-bootstrap/theming
parent: plugins/ngrid-bootstrap
ordinal: 0
tags: theme,theming,bootstrap
---
# Bootstrap Theming

There are 2 pre-built CSS themes provided in `@pebula/ngrid-bootstrap/themes`:

- default-light.css
- default-dark.css

If you're using Angular CLI & SCSS, this is as simple as including one line in your `styles.scss` file:

```scss
@use '~bootstrap/dist/css/bootstrap';
@use '@pebula/ngrid-bootstrap/themes/default-light.css';
```

Alternatively, you can [add your chosen CSS file to the styles array of your project's angular.json file](https://angular.io/guide/workspace-config#styles-and-scripts-configuration) or just reference the file directly.

```html
<link href="node_modules/bootstrap/dist/css/bootstrap.css" rel="stylesheet">
<link href="node_modules/@pebula/ngrid-bootstrap/themes/default-light.css" rel="stylesheet">
```

## Customized Bootstrap Themes (SCSS)

While bootstrap comes with it's own theming <a href="https://getbootstrap.com/docs/4.5/getting-started/theming" target="_blank">SCSS framework</a> it is not
part of or compatible with **nGrid**.  
**nGrid's** theme system is based on the theme system from `@angular/material`.

Don't worry, it is possible, we simply need to map between bootstrap's colors, spacing and typography to **nGrid**.

I> **nGrid's** theme system is based on the material system refers only for the tolling and interfaces, how color schemas and palettes are defined.  
The actual style is not material designed based and does not follow it's spec!

> Note that pre-built CSS themes are located in `@pebula/ngrid-bootstrap/themes` and the SCSS theming utilities are located in `@pebula/ngrid-bootstrap`
