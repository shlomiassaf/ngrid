# N-GRID

[![npm (scoped)](https://img.shields.io/npm/v/@pebula/ngrid?logo=npm&logoColor=fff&label=ngrid&style=flat-square)](https://www.npmjs.com/package/@pebula/ngrid)
[![npm (scoped)](https://img.shields.io/npm/v/@pebula/ngrid-material?logo=npm&logoColor=fff&label=ngrid-material&style=flat-square)](https://www.npmjs.com/package/@pebula/ngrid-material)
[![npm (scoped)](https://img.shields.io/npm/v/@pebula/ngrid-bootstrap?logo=npm&logoColor=fff&label=ngrid-bootstrap&style=flat-square)](https://www.npmjs.com/package/@pebula/ngrid-bootstrap)

[![GitHub](https://img.shields.io/github/workflow/status/shlomiassaf/ngrid/Node%20CI?logo=github&style=flat-square&token=abc123def456&label=build)](https://github.com/shlomiassaf/ngrid/actions?query=workflow%3A%22Node+CI%22)
[![GitHub](https://img.shields.io/github/workflow/status/shlomiassaf/ngrid/GH%20Pages%20on%20release?style=flat-square&token=abc123def456&label=documentation)](https://shlomiassaf.github.io/ngrid/)
[![GitHub](https://img.shields.io/github/workflow/status/shlomiassaf/ngrid-starters/GH%20Pages%20on%20release?style=flat-square&token=abc123def456&label=ngrid-starters)](https://shlomiassaf.github.io/ngrid-starters/material/)
[![GitHub](https://img.shields.io/github/license/shlomiassaf/ngrid?style=flat-square)](https://github.com/shlomiassaf/ngrid/blob/master/LICENSE)

An angular based grid based on `@angular/cdk`.

With all the buzzwords you want:

- 👌 &nbsp; Enterprise grade
- 🧩 &nbsp; Highly extensible
- ✨ &nbsp; UI Agnostic
- 🏷️ &nbsp; Feature loaded

---

For full documentation, walk-through's and examples 📜 &nbsp; [visit the official site](https://shlomiassaf.github.io/ngrid)

---

Need help? Want to talk about a feature? Or just a casual chat...

[![Support Server](https://img.shields.io/discord/841313360289333254.svg?label=Discord&logo=Discord&colorB=7289da&style=for-the-badge)](https://discord.gg/DtkA8mbWeP)

Join to the discord channel and lets create a community together!

## ⚡&nbsp; Quick Start / Setup

Use the built-in schematics:

```bash
ng add @pebula/ngrid
```

> * `@pebula/ngrid` include secondary packages / plugins (e.g: `@pebula/ngrid/detail-row`)  
> * Use the *schematics* wizard to install additional plugins (e.g: `@pebula/ngrid-material` / `@pebula/ngrid-bootstrap`)

For how-to's, concepts, recipes and more, [visit the documentation site](https://shlomiassaf.github.io/ngrid)

## 🧅&nbsp; Versions 

| nGrid Version    | Angular Version | Documentation | Starters  
|------------------|-----------------|---------------|---------
| 4.x.x (Current)  | 12.x.x          | [Documentation](https://shlomiassaf.github.io/ngrid) | Starter @ [GitHub](https://github.com/shlomiassaf/ngrid-material-starter) / [StackBlitz](https://stackblitz.com/edit/pebula-ngrid-starter?file=app%2Fapp.component.ts) / [CodeSandbox](https://codesandbox.io/s/pebula-ngrid-starter-yrgdd) |
| 3.x.x            | 11.x.x          | [Documentation](https://shlomiassaf.github.io/ngrid/v3) | Starter @ [GitHub](https://github.com/shlomiassaf/ngrid-material-starter/tree/v3) / [StackBlitz](https://stackblitz.com/edit/pebula-ngrid-starter-v3?file=app%2Fapp.component.ts) / [CodeSandbox](https://codesandbox.io/s/pebula-ngrid-starter-yrgdd) |
| 2.x.x            | 9.x.x - 10.x.x  | [Documentation](https://shlomiassaf.github.io/ngrid/v2) | Starter @ [GitHub](https://github.com/shlomiassaf/ngrid-material-starter/tree/v2) / [StackBlitz](https://stackblitz.com/edit/pebula-ngrid-starter-v2) |
| 1.x.x            | 6.x.x - 8.x.x   | [Documentation](https://shlomiassaf.github.io/ngrid/v1) | Starter @ [GitHub](https://github.com/shlomiassaf/ngrid-material-starter/tree/v8) / [StackBlitz](https://stackblitz.com/edit/pebula-ngrid-starter-v8?file=app%2Fapp.component.ts) |

> * Documentation site contains live examples including source code.
> * Live code demos (StackBlitz/CodeSandbox) might experience issues with some feature especially when IVY enabled, if you find it hard to use them please run your code locally.


## 🏄‍♀️&nbsp; Quick Feature Overview

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

A similar extension also exists for bootstrap at `@pebula/ngrid-bootstrap`

---

### If you like this product and want to help, WELCOME

Please see the TODO section at the bottom, help is much appreciated. The
documentation is the KEY

---

## 🏗️ Structure

N-Grid is built on top of building block taken from `@angular/cdk`. The most obvious is the `CdkTable` but other constructs are used as well (e.g. selection, drag & drop, etc...)

The grid is highly extensible. The design aims to support plugins and extensions, especially for the UI layer.

To support this structure there are several packages, some having secondary
packages inside them:

## 🥅 Design goals

- Developer ergonomics
- Performance
- Extensibility (features via plugins)

> In other words: Easy to use, fast and with loads of features.

We try to cut down complexity by splitting features into plugins and having a default option at all times so integration is seamless.

Daily, mundane and repetitive routines like setting up a datasource or creating a column definition are packed into factories that make it easy to use.

Templates should be shared and reused, define a template once and use it multiple times.
