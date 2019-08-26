import { isDevMode } from '@angular/core';
import { PblColumnStore } from '../table/columns/column-store';

export function setIdentityProp(store: PblColumnStore, identityProp: string): void {
  if (store.allColumns.length > 0 && identityProp) {
    // STATES:
    //    1: identityProp but also primary
    //    2: identityProp, no primary, AND not found
    //    3: identityProp, no primary but found.
    let state = 1;
    if (!store.primary) {
      state = 2;
      const column = store.find(identityProp);
      if (column && column.data) {
        state = 3;
        store['_primary'] = column.data;
      }
    }

    if (isDevMode()) {
      const genericMsg = `The [identityProp] input is deprecated, please remove it and use "pIndex" on the column definition instead.`;
      switch (state) {
        case 1:
          console.warn(
`${genericMsg}
Found column "${store.primary.id}" defined with the new method (pIndex), ignoring "${identityProp}" set in [identityProp]`
);
          break;
        case 2:
          console.warn(
`${genericMsg}
Could not find a column defined with the new method (pIndex).
Trying to locate the column "${identityProp}" defined in [identityProp] FAILED! with no match.
AN IDENTITY COLUMN WAS NOT SET`
);
          break;
        case 3:
            console.warn(
`${genericMsg}
Could not find a column defined with the new method (pIndex).
Trying to locate the column "${identityProp}" defined in [identityProp] SUCCEEDED!.
USING "${identityProp}" AS THE IDENTITY COLUMN.`
);
          break;
      }
    }
  }
}
