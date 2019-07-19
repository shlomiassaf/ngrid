import { Component } from '@angular/core';
import { RouterLinkWithHref, RouterLink } from '@angular/router';
import { MarkdownPagesMenuService } from '@pebula/apps/shared';

declare const ANGULAR_VERSION: string;
declare const NGRID_VERSION: string;

@Component({
  selector: 'pbl-demo-home-page',
  templateUrl: './demo-home-page.component.html',
  styleUrls: ['./demo-home-page.component.scss']
})
export class DemoHomePageComponent {
  ngVersion = ANGULAR_VERSION;
  ngridVersion = NGRID_VERSION;

  demoLinks = [
    { cmd: [ '/', 'demos', 'complex-demo-1' ], text: 'Demo #1' },
    { cmd: [ '/', 'demos', 'virtual-scroll-performance' ], text: 'Virtual Scroll Demo' },
  ];
  selectedDemoLink: any;

  topMenuItems: ReturnType<MarkdownPagesMenuService['ofType']> = this.mdMenu.ofType('topMenuSection');

  constructor(private mdMenu: MarkdownPagesMenuService) { }

  demoLinkStatusChanged(event: { isActive: boolean; findRouterLink: (commands: any[]|string) => RouterLinkWithHref | RouterLink | undefined; }) {
    this.selectedDemoLink = null;
    if (event.isActive) {
      this.selectedDemoLink = this.demoLinks.find( dl => !!event.findRouterLink(dl.cmd) );
    }
  }
}
