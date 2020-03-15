![npm (scoped)](https://img.shields.io/npm/v/@pebula/ngrid?label=ngrid&style=flat-square)
![npm (scoped)](https://img.shields.io/npm/v/@pebula/ngrid-material?label=ngrid-material&style=flat-square)
![CircleCI](https://img.shields.io/circleci/build/github/shlomiassaf/ngrid/master?style=flat-square&token=abc123def456)
![CircleCI](https://img.shields.io/circleci/build/github/shlomiassaf/ngrid-material-starter/master?style=flat-square&token=abc123def456&label=ngrid-material-starter)
![GitHub](https://img.shields.io/github/license/shlomiassaf/ngrid?style=flat-square)

# N-GRID

An angular based grid based on `@angular/cdk`.

With all the buzzwords you want:

- Enterprise grade
- Highly extensible
- UI Agnostic
- Feature loaded

---

For full documentation, walkthroughs and examples - [visit the official site](https://shlomiassaf.github.io/ngrid)

---

## Quick Start

- [Documentation site](https://shlomiassaf.github.io/ngrid) with code samples.
- [Starter @ GitHub](https://github.com/shlomiassaf/ngrid-material-starter)
- [Starter @ StackBlitz](https://stackblitz.com/edit/pebula-ngrid-starter-v9?file=app%2Fapp.component.ts)

### Version 1.x.x - angular V8

- [Starter @ GitHub](https://github.com/shlomiassaf/ngrid-material-starter/tree/v8)
- [Starter @ StackBlitz](https://stackblitz.com/edit/pebula-ngrid-starter?file=app%2Fapp.component.ts)

## Setup

```bash
yarn add @pebula/utils @pebula/ngrid @pebula/ngrid-material
```

> Packages include secondary packages / plugins (e.g: `@pebula/ngrid/detail-row`)
> This setup will install ngrid with material design cell pack.

## Quick Feature Overview

`@pebula/ngrid` comes with building blocks and features tied to the core of the grid.

Some of the feature are:

- Easy to use column and datasource integration
- Virtual Scrolling (Vertical)
- Column: Resize / Reorder / Edit / Hide
- Smart column / cell size management
- Group headers and logical groups.
- Rich and powerful theming system (SCSS)

In addition, there are several secondary packages that **extend** the functionality **when opted-in**:

- `@pebula/ngrid/target-events` - Support for input device events (click, keyboard, selection)
- `@pebula/ngrid/clipboard` - Copy cell selection to the clipboard
- `@pebula/ngrid/state` - Saving and restoring state from and to the grid
- `@pebula/ngrid/detail-row` - Support for master / detail row structure
- `@pebula/ngrid/drag` - Support for drag and drop (using `@angular/cdk/drag`)
- `@pebula/ngrid/sticky` - Support for sticky rows / columns
- `@pebula/ngrid/transpose` - Support for live transpose (switch between rows & columns)
- `@pebula/ngrid/overlay-panel` - A plugin for grid overlay (popups) similar to the overlay tools in `@angular/cdk` but with cell orientation (set position based on cell location)
- And more...

To top that, a UI extension that make use of `@angular/material` components called `@pebula/ngrid-material`, with things like:

- Automatic cell tooltip (Only when text is truncated)
- Selection Column (with mat-checkbox)
- Sorting Header (with matSort)
- Pagination (with material pagination tools)
- Context Menu (using MatMenu)

---

### If you like this product and want to help, WELCOME

Please see the TODO section at the bottom, help is much appreciated. The
documentation is the KEY

---

## Structure

N-Grid is built on top of building block taken from `@angular/cdk`. The most obvious is the `CdkTable` but other constructs are used as well (e.g. selection, drag & drop, etc...)

The grid is highly extensible. The design aims to support plugins and extensions, especially for the UI layer.

To support this structure there are several packages, some having secondary
packages inside them:

## Design goals

- Developer ergonomics
- Performance
- Extensibility (features via plugins)

> In other words: Easy to use, fast and with loads of features.

We try to cut down complexity by splitting features into plugins and having a default option at all times so integration is seamless.

Daily, mundane and repetitive routines like setting up a datasource or creating a column definition are packed into factories that make it easy to use.

Templates should be shared and reused, define a template once and use it multiple times.

## Versioning

The `master` repository is for version 2.x.x and onwards of **nGrid** which aligns with angular 9.0.6+

For angular 7-8 versions, use the 1.x.x versions [Code Here](https://github.com/shlomiassaf/ngrid/tree/1.x.x-(angular-v8))

> Note that only critical patches will be issued to the existing 1.x.x version.
