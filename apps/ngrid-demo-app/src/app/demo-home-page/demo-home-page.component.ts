import { Component } from '@angular/core';
import { RouterLinkWithHref, RouterLink } from '@angular/router';

@Component({
  selector: 'pbl-demo-home-page',
  templateUrl: './demo-home-page.component.html',
  styleUrls: ['./demo-home-page.component.scss']
})
export class DemoHomePageComponent {
  demoLinks = [
    { cmd: [ '/', 'demos', 'all-in-one' ], text: 'Demo #1' },
    { cmd: [ '/', 'demos', 'virtual-scroll-performance' ], text: 'Virtual Scroll Demo' },
  ];
  selectedDemoLink: any;

  demoLinkStatusChanged(event: { isActive: boolean; findRouterLink: (commands: any[]|string) => RouterLinkWithHref | RouterLink | undefined; }) {
    this.selectedDemoLink = null;
    if (event.isActive) {
      this.selectedDemoLink = this.demoLinks.find( dl => !!event.findRouterLink(dl.cmd) );
    }
  }
}
