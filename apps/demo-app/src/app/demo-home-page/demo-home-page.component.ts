import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ExampleGroupRegistryService } from '@sac/demo-apps/shared';

@Component({
  selector: 'sac-demo-home-page',
  templateUrl: './demo-home-page.component.html',
  styleUrls: ['./demo-home-page.component.scss']
})
export class DemoHomePageComponent {

  constructor(public registry: ExampleGroupRegistryService) { }

}
