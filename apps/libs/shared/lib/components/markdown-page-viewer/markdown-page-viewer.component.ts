import { take } from 'rxjs/operators';
import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ElementRef,
  ViewContainerRef,
  Injector,
  NgZone,
  Type,
} from '@angular/core';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';

import { UnRx } from '@pebula/utils';
import { PageFileAsset } from '@pebula-internal/webpack-markdown-pages';
import { ExampleViewComponent } from '../exapmle-view/example-view.component';
import { ContentChunkViewComponent } from '../content-chunk-view/content-chunk-view.component';
import { MarkdownDynamicComponentPortal } from '../markdown-dynamic-component-portal';

import { MarkdownPagesService } from '../../services/markdown-pages.service';

@Component({
  selector: 'pbl-markdown-page-viewer',
  templateUrl: './markdown-page-viewer.component.html',
  styleUrls: ['./markdown-page-viewer.component.scss']
})
@UnRx()
export class MarkdownPageViewerComponent implements OnDestroy {

  @Input() set documentUrl(url: string) { this.updateDocument(url); }
  @Output() contentRendered = new EventEmitter<void>();

  page: PageFileAsset;
  private _portalHosts: DomPortalHost[] = [];

  constructor(private mdPages: MarkdownPagesService,
              private _elementRef: ElementRef,
              private _appRef: ApplicationRef,
              private _componentFactoryResolver: ComponentFactoryResolver,
              private _injector: Injector,
              private _viewContainerRef: ViewContainerRef,
              private _ngZone: NgZone,) {}

  private updateDocument(url: string) {
    if (!url) {
      document.title = '';
      this._elementRef.nativeElement.innerHTML = '';
      return;
    }
    this.mdPages.getPage(url)
      .then( p => {
        this.page = p;
        document.title = p.title;
        this._elementRef.nativeElement.innerHTML = p.contents;

        this._loadComponents('pbl-example-view', ExampleViewComponent);
        this._loadComponents('pbl-app-content-chunk', ContentChunkViewComponent);

        this._ngZone.onStable.pipe(take(1)).subscribe(() => this.contentRendered.next());
      });
  }

  private _loadComponents<T extends MarkdownDynamicComponentPortal>(componentName: string, componentClass: Type<T>) {
    let exampleElements = this._elementRef.nativeElement.querySelectorAll(`[${componentName}]`);

    Array.prototype.slice.call(exampleElements).forEach((element: Element) => {
      const ident = element.getAttribute(componentName);
      const containerClass = element.getAttribute('containerClass');
      const inputs = element.getAttribute('inputs');
      const portalHost = new DomPortalHost(element, this._componentFactoryResolver, this._appRef, this._injector);
      const cmpPortal = new ComponentPortal(componentClass, this._viewContainerRef);
      const cmpRef = portalHost.attach(cmpPortal);

      if (inputs) {
        try {
          cmpRef.instance.inputParams = JSON.parse(inputs);
        } catch(err) { }
      }
      cmpRef.instance.componentName = ident;
      cmpRef.instance.containerClass = containerClass;
      cmpRef.instance.render();
      cmpRef.changeDetectorRef.markForCheck();
      cmpRef.changeDetectorRef.detectChanges();
      this._portalHosts.push(portalHost);
    });
  }

  private _clearLiveExamples() {
    this._portalHosts.forEach(h => h.dispose());
    this._portalHosts = [];
  }

  ngOnDestroy(): void {
    this._clearLiveExamples();
  }
}
