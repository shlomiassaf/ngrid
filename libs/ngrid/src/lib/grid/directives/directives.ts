// tslint:disable:use-host-property-decorator
import { Directive, TemplateRef, AfterViewInit } from '@angular/core';

import { PblNgridComponent } from '../ngrid.component';

/**
 * A directive that marks the template as a projected section inside the grid.
 * The location of the project content is set by the position input.
 *
 * Note that this directive can only be set as the content inside the grid.
 */
@Directive({
  selector: '[pblNgridOuterSection]',
  inputs: [ 'position:pblNgridOuterSection' ] // tslint:disable-line:use-input-property-decorator
})
export class PblNgridOuterSectionDirective implements AfterViewInit {

  position: 'top' | 'bottom'; // tslint:disable-line:no-input-rename

  constructor(private grid: PblNgridComponent<any>, private tRef: TemplateRef<{ $implicit: PblNgridComponent<any> }>) { }

  ngAfterViewInit(): void {
    this.grid.createView(this.position === 'bottom' ? 'beforeContent' : 'beforeTable', this.tRef);
  }
}
