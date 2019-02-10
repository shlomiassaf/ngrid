import { Component, Input } from '@angular/core';

import { ExampleGroupRegistryService } from './example-group-registry.service';

@Component({
  selector: 'pbl-example-group',
  templateUrl: './example-group.component.html',
  styleUrls: [ './example-group.component.scss' ]
})
export class ExampleGroupComponent {
  @Input() hideToc: boolean;

  /**
   * When set, will insert a link to the root URL for this example group
   */
  @Input() rootLink: string;

  constructor(public registry: ExampleGroupRegistryService) { }
}
