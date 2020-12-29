---
title: Header Title And Translation
path: recipes/header-title-and-translation
parent: recipes
---
# Header Title And Translation

A lot of the times property names can also be used as labels or, you would like to use pipe-based translations (e.g ngx-translate).

Here is an example for an angular **pipe** which transforms a string into a title.  
For example, it will convert `name` to `Name`.

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'headerToTitle'})
export class HeaderToTitlePipe implements PipeTransform {
  transform(value: string): string {
    return value[0].toUpperCase() + value.slice(1);
  }
}

```

Now, all we need to do to use it is to define a new default, catch-all, header template:

```html
<div *pblNgridHeaderCellDef="'*'; col as col;">{{col.label | headerToTitle}}</div>

```

The same approach can be used to translation.

I> The label property (`col.label` above) is part of the column definition.  
When not set, it is automatically populated with the value set in the `prop` property, which is mandatory.

<div pbl-example-view="pbl-header-title-and-translation-example"></div>
