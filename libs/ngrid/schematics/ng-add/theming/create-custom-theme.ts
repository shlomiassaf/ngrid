/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** Create custom theme for the given application configuration. */
export function createCustomTheme(name: string = 'app') {
return `
@use '~@pebula/ngrid' as ngrid;

$${name}-palette: ngrid.define-palette(ngrid.$blue-palette);

$${name}-theme: ngrid.define-light-theme($${name}-palette);

@include ngrid.ngrid-typography();

@include ngrid.ngrid-theme($${name}-theme);

`;
}
