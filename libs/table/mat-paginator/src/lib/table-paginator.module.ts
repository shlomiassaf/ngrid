import { NgModule, ComponentFactoryResolver, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { SgTableModule } from '@sac/table';
import { SgPaginatorComponent } from './table-paginator.component';
// TODO: Remove MatPaginatorModule and the initial code in the constructor
// set the styles in the SCSS.

@NgModule({
  imports: [ CommonModule, MatPaginatorModule, MatSelectModule, MatTooltipModule, MatButtonModule, SgTableModule ],
  declarations: [ SgPaginatorComponent ],
  exports: [ SgPaginatorComponent ],
  entryComponents: [ SgPaginatorComponent, MatPaginator ]
})
export class SgTablePaginatorModule {
  constructor(cf: ComponentFactoryResolver, injector: Injector) {
    // this is a workaround to ensure CSS from mat slider is loaded, otherwise it is omitted.
    cf.resolveComponentFactory(MatPaginator).create(injector);
  }
}
