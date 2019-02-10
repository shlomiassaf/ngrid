// tslint:disable:use-host-property-decorator
import { Directive, TemplateRef, AfterViewInit } from '@angular/core';

import { PblTableComponent } from '../table.component';

/**
 * A directive that marks the template as a projected section inside the table.
 * The location of the project content is set by the position input.
 *
 * Note that this directive can only be set as the content inside the table.
 */
@Directive({
  selector: '[pblTableOuterSection]',
  inputs: [ 'position:pblTableOuterSection' ] // tslint:disable-line:use-input-property-decorator
})
export class PblTableOuterSectionDirective implements AfterViewInit {

  position: 'top' | 'bottom'; // tslint:disable-line:no-input-rename

  constructor(private table: PblTableComponent<any>, private tRef: TemplateRef<{ $implicit: PblTableComponent<any> }>) { }

  ngAfterViewInit(): void {
    this.table.createView(this.position === 'bottom' ? 'beforeContent' : 'beforeTable', this.tRef);
  }
}
