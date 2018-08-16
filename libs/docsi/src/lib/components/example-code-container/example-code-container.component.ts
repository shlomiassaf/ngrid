import { ReplaySubject } from 'rxjs';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Output } from '@angular/core';

import { ExampleCodeStoreService } from '../../services';
import { ExtractedCodeGroup } from '../../models';

@Component({
  selector: 'docsi-example-code-container',
  templateUrl: './example-code-container.component.html',
  styleUrls: ['./example-code-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleCodeContainerComponent {

  @Input() set extractId(value: string) {
    if (value) {
      this.exampleCodeStore.getPart(value)
        .then( cc => this.compiledCode.next(cc) );
    }
  }

  @Output() compiledCode = new ReplaySubject<ExtractedCodeGroup>(1);

  constructor(private exampleCodeStore: ExampleCodeStoreService) { }
}
