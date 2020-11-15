import { Component, ViewEncapsulation } from '@angular/core';

/** Root component for the dev-app demos. */
@Component({
  selector: 'pbl-dev-app-root',
  template: '<pbl-dev-app-layout><router-outlet></router-outlet></pbl-dev-app-layout>',
  encapsulation: ViewEncapsulation.None,
})
export class DevAppRootComponent {
}
