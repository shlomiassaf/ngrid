import { Component, ViewEncapsulation } from '@angular/core';
import { ROUTES } from '../../../routes';

@Component({
  selector: 'pbl-dev-app-layout',
  templateUrl: './dev-app-layout.component.html',
  styleUrls: ['./dev-app-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DevAppLayoutComponent {
  navItems = ROUTES
}
