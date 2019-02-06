// tslint:disable:use-host-property-decorator
import { Directive, TemplateRef, AfterViewInit } from '@angular/core';

import { NegTableComponent } from '../table.component';

/**
 * A directive that marks the template as a projected section inside the table.
 * The location of the project content is set by the position input.
 *
 * Note that this directive can only be set as the content inside the table.
 */
@Directive({
  selector: '[negTableOuterSection]',
  inputs: [ 'position:negTableOuterSection' ] // tslint:disable-line:use-input-property-decorator
})
export class NegTableOuterSectionDirective implements AfterViewInit {

  position: 'top' | 'bottom'; // tslint:disable-line:no-input-rename

  constructor(private table: NegTableComponent<any>, private tRef: TemplateRef<{ $implicit: NegTableComponent<any> }>) { }

  ngAfterViewInit(): void {
    this.table.createView(this.position === 'bottom' ? 'beforeContent' : 'beforeTable', this.tRef);
  }
}
