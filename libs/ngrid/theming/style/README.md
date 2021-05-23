# Theming

Instead of designing a complete new theming system, the theming in `@pebula/ngrid` is based on the theming system in the **angular materia/components** project.

This raises an issue since the theming system is actually in `@angular/components/core` which means that to use it we need to add it as a dependency, which we don't want to do.  
`@pebula/ngrid` depends on `@angular/cdk` but it is not "material" specific so coupling it with `@angular/components/core` does not make sense.

To solve this issue some of the theming tools in `@angular/components/core` were hard-copied into this repo and their prefix was changed to `pbl-XXX` instaed of `mat-XXX` to prevent collisions when using together with the material theming system.

## Palette

Only 2 palettes were adopted from material, `mat-blue` and `mat-grey` renamed respectively to `pbl-blue` and `pbl-grey`.

### Background and Foreground

The background and foreground maps contains unique keys for `ngrid` but compatible with material so you can provide a material generated map
with the additional keys required for ngrid.

> All of the ngrid related keys are prefixed with `ngrid-`
