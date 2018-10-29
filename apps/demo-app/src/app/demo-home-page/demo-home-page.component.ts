import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ExampleGroupRegistryService } from '@neg/demo-apps/shared';

@Component({
  selector: 'neg-demo-home-page',
  templateUrl: './demo-home-page.component.html',
  styleUrls: ['./demo-home-page.component.scss']
})
export class DemoHomePageComponent {

  constructor(public registry: ExampleGroupRegistryService) {
  }

}
