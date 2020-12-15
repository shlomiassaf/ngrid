import { CdkColumnDef } from '@angular/cdk/table';
import { PblColumnTypeDefinition } from '../column/model';

const COLUMN_NAME_CSS_PREFIX = 'pbl-ngrid-column';

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
