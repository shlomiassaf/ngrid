/**
 * This file contains constants shared between modules (files) that if not extract will cause a circular dependency
 */

import { CdkColumnDef } from '@angular/cdk/table';
import { PblColumnTypeDefinition } from './columns/types';

const COLUMN_NAME_CSS_PREFIX = 'pbl-ngrid-column';
export const COLUMN_EDITABLE_CELL_CLASS = 'pbl-ngrid-editable-cell';

/**
 * Returns a css class unique to the column
 */
export function uniqueColumnCss(columnDef: CdkColumnDef): string {
  return `${COLUMN_NAME_CSS_PREFIX}-${columnDef.cssClassFriendlyName}`;
}

/**
 * Returns a css class unique to the type of the column (columns might share types)
 */
export function uniqueColumnTypeCss(type: PblColumnTypeDefinition): string {
  return `${COLUMN_NAME_CSS_PREFIX}-type-${type.name}`;
}

