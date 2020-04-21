import { BehaviorSubject } from 'rxjs';
import {
  Component,
  InjectionToken,
  Inject,
  OnDestroy,
} from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'

import { utils } from '@pebula/ngrid';
import { ExampleFileAsset } from '@pebula-internal/webpack-markdown-code-examples';

import { MarkdownDynamicComponentPortal } from '../markdown-dynamic-component-portal';
import { MarkdownCodeExamplesService } from '../../services/markdown-code-examples.service';
import { LazyModuleStoreService } from '../../services/lazy-module-store';
import { LiveExample } from '../../example';

export const EXAMPLE_COMPONENTS_TOKEN = new InjectionToken('EXAMPLE_COMPONENTS');

@Component({
  selector: 'pbl-example-view',
  templateUrl: './example-view.component.html',
  styleUrls: ['./example-view.component.scss'],
  host: {
    '[class.example-style-flow]': 'exampleStyle === "flow"',
    '[class.example-style-toolbar]': 'exampleStyle === "toolbar"',
  },
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({transform: 'translateX(200%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(200%)'}))
      ])
    ])
  ]
})
export class ExampleViewComponent extends MarkdownDynamicComponentPortal implements OnDestroy {
  exampleData: LiveExample;
  sourceCode = new BehaviorSubject<ExampleFileAsset[]>(null);
  viewSourceCode = false;
  exampleStyle: 'toolbar' | 'flow' = 'toolbar';

  constructor(lazyModuleStore: LazyModuleStoreService,
              private exampleService: MarkdownCodeExamplesService,
              @Inject(EXAMPLE_COMPONENTS_TOKEN) private exampleComponents: {[key: string]: LiveExample} ) {
    super(lazyModuleStore);
  }

  getRenderTypes(selector: string) {
    this.sourceCode.next(null);
    this.exampleData = this.exampleComponents[selector];
    return this.exampleData;
  }

  render(): void {
    super.render();
    if (!this.containerClass) {
      this.containerClass = 'table-height-300 mat-elevation-z7';
    }
    this.exampleService.getExample(this.componentName)
      .then( assets => this.sourceCode.next(assets) );
  }

  ngOnDestroy(): void {
    this.sourceCode.complete();
    utils.unrx.kill(this);
  }
}
