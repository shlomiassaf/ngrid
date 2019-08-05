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

  selectedDemoLink: any;

  topMenuItems: ReturnType<MarkdownPagesMenuService['ofType']> = this.mdMenu.ofType('topMenuSection');
  demoLinks = this.mdMenu.ofType('singlePage')
    .then( entries => {
      const demoLinks = entries
        .filter( e => e.subType === 'demoPage' )
        .map( e => {
          return {
            cmd: e.path.split('/'),
            text: e.title
          }
        });
      return this._demoLinks = demoLinks;
    });

  private _demoLinks: Array<{ cmd: any[], text: string }>;

  constructor(private mdMenu: MarkdownPagesMenuService) { }

  demoLinkStatusChanged(event: { isActive: boolean; findRouterLink: (commands: any[]|string) => RouterLinkWithHref | RouterLink | undefined; }) {
    this.selectedDemoLink = null;
    if (event.isActive) {
      if (!this._demoLinks) {
        this.demoLinks.then( () => this.demoLinkStatusChanged(event) );
        return;
      }
      this.selectedDemoLink = this._demoLinks.find( dl => !!event.findRouterLink(dl.cmd) );
    }
  }
}
