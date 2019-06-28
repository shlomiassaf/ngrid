import { Subject } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UnRx } from '@pebula/utils';
import { TocAreaDirective } from '@pebula-internal/docsi/toc';

import { MarkdownPagesMenuService } from '../../services/markdown-pages-menu.service';

@Component({
  selector: 'pbl-markdown-page-container',
  templateUrl: './markdown-page-container.component.html',
  styleUrls: ['./markdown-page-container.component.scss']
})
@UnRx()
export class MarkdownPageContainerComponent implements OnDestroy {

  entry: string;
  documentUrl: string;
  @ViewChild('tocArea', { static: true, read: TocAreaDirective}) tocArea: TocAreaDirective;

  menu$ = new Subject<any>();

  constructor(private mdPagesMenu: MarkdownPagesMenuService, private route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.route.url
      .pipe(
        debounceTime(1),
        map( urlSegments => urlSegments.map(u => u.path) ),
        UnRx(this)
      )
      .subscribe( paths => this.handleUrlUpdate(paths) );
  }

  ngOnDestroy(): void {
    this.menu$.complete();
  }

  getRouterLink(path: string): any[] {
    return ['/content', ...path.split('/')];
  }

  contentRendered(): void {
    this.tocArea.reinitQueryLinks(Promise.resolve());
  }

  private handleUrlUpdate(paths: string[]): void {
    if (this.entry !== paths[0]) {
      this.entry = paths[0];
      this.mdPagesMenu.getMenu(this.entry)
        .then( entry => {
          this.menu$.next(entry);
        });
    }

    this.documentUrl = paths.join('/');
  }
}
