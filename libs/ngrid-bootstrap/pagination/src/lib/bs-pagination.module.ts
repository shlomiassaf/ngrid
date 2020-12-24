import { NgModule, ComponentFactoryResolver, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBsPagination } from './bs-pagination.component';

@NgModule({
  imports: [ CommonModule, NgbPaginationModule, PblNgridModule ],
  declarations: [ PblNgridBsPagination ],
  exports: [ NgbPaginationModule, PblNgridBsPagination ],
  // TODO(REFACTOR_REF 2): remove when ViewEngine is no longer supported by angular (V12 ???)
  entryComponents: [ PblNgridBsPagination ]
})
export class PblNgridBsPaginationModule { }
