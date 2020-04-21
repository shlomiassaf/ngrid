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
  Optional,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import { MetaService } from '@ngx-meta/core';

import { utils } from '@pebula/ngrid';
import { PageFileAsset } from '@pebula-internal/webpack-markdown-pages';
import { ExampleViewComponent } from '../exapmle-view/example-view.component';
import { ContentChunkViewComponent } from '../content-chunk-view/content-chunk-view.component';
import { MarkdownDynamicComponentPortal } from '../markdown-dynamic-component-portal';
import { MarkdownPagesService } from '../../services/markdown-pages.service';
import { LocationService } from '../../services/location.service';
import { MarkdownPageContainerComponent } from '../markdown-page-container/markdown-page-container.component';

@Component({
  selector: 'pbl-markdown-page-viewer',
  templateUrl: './markdown-page-viewer.component.html',
  styleUrls: ['./markdown-page-viewer.component.scss'],
  host: {
    class: 'markdown-body',
    '[class.no-parent-container]': '!hasContainer',
  }
})
export class MarkdownPageViewerComponent implements OnDestroy {

  @Input() set documentUrl(url: string) { this.updateDocument(url); }
  @Output() contentRendered = new EventEmitter<void>();

  page: PageFileAsset;
  readonly hasContainer: boolean;

  private _portalHosts: DomPortalHost[] = [];

  constructor(private mdPages: MarkdownPagesService,
              private meta: MetaService,
              private locationService: LocationService,
              route: ActivatedRoute,
              private _elementRef: ElementRef,
              private _appRef: ApplicationRef,
              private _componentFactoryResolver: ComponentFactoryResolver,
              private _injector: Injector,
              private _viewContainerRef: ViewContainerRef,
              private _ngZone: NgZone,
              @Optional() container: MarkdownPageContainerComponent) {
    this.hasContainer = !!container;
    route.data.pipe(utils.unrx(this)).subscribe( data => {
      if (data.documentUrl) {
        this.updateDocument(data.documentUrl);
      }
    });
  }

  @HostListener('click', ['$event.target', '$event.button', '$event.ctrlKey', '$event.metaKey', '$event.altKey'])
  onClick(eventTarget: HTMLElement, button: number, ctrlKey: boolean, metaKey: boolean, altKey: boolean): boolean {
    // Deal with anchor clicks; climb DOM tree until anchor found (or null)
    let target: HTMLElement|null = eventTarget;
    while (target && !(target instanceof HTMLAnchorElement)) {
      target = target.parentElement;
    }
    if (target instanceof HTMLAnchorElement) {
      return this.locationService.handleAnchorClick(target, button, ctrlKey, metaKey);
    }

    // Allow the click to pass through
    return true;
  }

  private updateDocument(url: string) {
    this._clearLiveExamples();
    if (!url) {
      this.meta.setTitle(``);
      this._elementRef.nativeElement.innerHTML = '';
      return;
    }
    this.mdPages.getPage(url)
      .then( p => {
        this.page = p;
        this.meta.setTitle(`NGrid: ${p.title}`);
        this._elementRef.nativeElement.innerHTML = p.contents;

        if (typeof this._elementRef.nativeElement.getBoundingClientRect === 'function') {
          this._loadComponents('pbl-example-view', ExampleViewComponent);
          this._loadComponents('pbl-app-content-chunk', ContentChunkViewComponent);
        }

        this._ngZone.onStable.pipe(take(1)).subscribe(() => this.contentRendered.next());
      });
  }

  private _loadComponents<T extends MarkdownDynamicComponentPortal>(componentName: string, componentClass: Type<T>) {
    let exampleElements = this._elementRef.nativeElement.querySelectorAll(`[${componentName}]`);

    Array.prototype.slice.call(exampleElements).forEach((element: Element) => {
      const ident = element.getAttribute(componentName);
      const containerClass = element.getAttribute('containerClass');
      const inputs = element.getAttribute('inputs');
      const exampleStyle = element.getAttribute('exampleStyle');

      const portalHost = new DomPortalHost(element, this._componentFactoryResolver, this._appRef, this._injector);
      const cmpPortal = new ComponentPortal(componentClass, this._viewContainerRef);
      const cmpRef = portalHost.attach(cmpPortal);

      if (exampleStyle) {
        (cmpRef.instance as any).exampleStyle = exampleStyle;
      }
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
    utils.unrx.kill(this);
  }
}
