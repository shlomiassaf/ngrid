import { NgModule, ComponentFactoryResolver, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { NegTableModule } from '@pebula/table';
import { NegPaginatorComponent } from './table-paginator.component';
// TODO: Remove MatPaginatorModule and the initial code in the constructor
// set the styles in the SCSS.

@NgModule({
  imports: [ CommonModule, MatPaginatorModule, MatSelectModule, MatTooltipModule, MatButtonModule, NegTableModule ],
  declarations: [ NegPaginatorComponent ],
  exports: [ NegPaginatorComponent ],
  entryComponents: [ NegPaginatorComponent, MatPaginator ]
})
export class NegTablePaginatorModule {
  constructor(cf: ComponentFactoryResolver, injector: Injector) {
    // this is a workaround to ensure CSS from mat slider is loaded, otherwise it is omitted.
    cf.resolveComponentFactory(MatPaginator).create(injector);
  }
}
