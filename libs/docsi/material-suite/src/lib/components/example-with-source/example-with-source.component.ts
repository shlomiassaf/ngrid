import { Component, Input, ChangeDetectionStrategy, Inject, Optional, ChangeDetectorRef } from '@angular/core';

import { ExampleCodeContainerComponent, ExtractedCodeGroup, ExtractedCodeQuery } from '@neg/docsi';

@Component({
  selector: 'docsi-mat-example-with-source',
  templateUrl: './example-with-source.component.html',
  styleUrls: [ './example-with-source.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleWithSourceComponent {
  @Input() title: string;
  @Input() query: ExtractedCodeQuery | string;
  @Input() extractedCodeGroup: ExtractedCodeGroup;

 /**
  * The class of the element that wraps the rendered component.
  */
  @Input() contentClass: string;
  viewSourceCode = false;

  constructor(@Optional() @Inject(ExampleCodeContainerComponent) container: ExampleCodeContainerComponent,
              private cdr: ChangeDetectorRef) {
    if (container) {
      container.compiledCode.subscribe( cc => {
        this.extractedCodeGroup = cc;
        this.cdr.detectChanges();
      });
    }
  }
}
