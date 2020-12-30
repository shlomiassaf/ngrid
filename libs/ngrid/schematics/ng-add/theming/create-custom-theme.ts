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
@import '~@pebula/ngrid/theming';

$${name}-palette: pbl-palette($pbl-blue);

$${name}-theme: pbl-light-theme($${name}-palette);

@include pbl-ngrid-typography();

@include pbl-ngrid-theme($${name}-theme);

`;
}
