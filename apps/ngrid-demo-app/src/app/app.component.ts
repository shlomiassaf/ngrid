import { Component } from '@angular/core';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

@Component({
  selector: 'pbl-ngrid-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(angulartics2GoogleTagManager: Angulartics2GoogleTagManager) {
    angulartics2GoogleTagManager.startTracking();
  }
}
