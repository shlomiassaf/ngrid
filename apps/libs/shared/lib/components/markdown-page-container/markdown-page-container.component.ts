import { Subject } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Component, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { utils } from '@pebula/ngrid';
import { TocAreaDirective } from '../../toc.module';

import { MarkdownPagesMenuService } from '../../services/markdown-pages-menu.service';

declare const ANGULAR_VERSION: string;
declare const CDK_VERSION: string;
declare const NGRID_VERSION: string;
declare const BUILD_VERSION: string;

@Component({
  selector: 'pbl-markdown-page-container',
  templateUrl: './markdown-page-container.component.html',
  styleUrls: ['./markdown-page-container.component.scss']
})
export class MarkdownPageContainerComponent implements OnDestroy {

  entry: string;
  documentUrl: string;
  @ViewChild('tocArea', { static: true, read: TocAreaDirective}) tocArea: TocAreaDirective;

  menu$ = new Subject<any>();

  ngVersion = ANGULAR_VERSION;
  cdkVersion = CDK_VERSION;
  ngridVersion = NGRID_VERSION;
  buildVersion = BUILD_VERSION;

  constructor(private mdPagesMenu: MarkdownPagesMenuService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.route.url
      .pipe(
        debounceTime(1),
        map( urlSegments => urlSegments.map(u => u.path) ),
        utils.unrx(this)
      )
      .subscribe( paths => this.handleUrlUpdate(paths) );
  }

  ngOnDestroy(): void {
    this.menu$.complete();
    utils.unrx.kill(this);
  }

  getRouterLink(path: string): any[] {
    const routeLink = path.split('/');
    if (routeLink[0] !== '/') {
      routeLink.unshift('/');
    }
    return routeLink;
  }

  contentRendered(): void {
    this.tocArea.reinitQueryLinks(Promise.resolve())
      .then(() => this.cdr.detectChanges());
  }

  private handleUrlUpdate(paths: string[]): void {
    if (this.entry !== paths[0]) {
      this.entry = paths[0];
      this.mdPagesMenu.getMenu(this.entry)
        .then( entry => {
          this.menu$.next(entry);
        })
        .catch(err => this.menu$.next(null) );
    }

    this.documentUrl = paths.length ? paths.join('/') : '/';
  }
}
