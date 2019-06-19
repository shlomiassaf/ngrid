import { Component } from '@angular/core';

declare const ANGULAR_VERSION: string;
declare const NGRID_VERSION: string;

@Component({
  selector: 'pbl-app-home-page',
  templateUrl: './app-home-page.component.html',
  styleUrls: ['./app-home-page.component.scss']
})
export class AppHomePageComponent {
  ngVersion = ANGULAR_VERSION;
  ngridVersion = NGRID_VERSION;
}
