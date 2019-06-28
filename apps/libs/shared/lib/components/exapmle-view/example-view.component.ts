import { BehaviorSubject } from 'rxjs';
import {
  Component,
  Type,
  InjectionToken,
  Inject,
  OnDestroy,
} from '@angular/core';

import { UnRx } from '@pebula/utils';
import { ExampleFileAsset } from '@pebula-internal/webpack-markdown-code-examples';

import { MarkdownDynamicComponentPortal } from '../markdown-dynamic-component-portal';
import { MarkdownCodeExamplesService } from '../../services/markdown-code-examples.service';
import { LiveExample } from '../../example';

export const EXAMPLE_COMPONENTS_TOKEN = new InjectionToken('EXAMPLE_COMPONENTS');

@Component({
  selector: 'pbl-example-view',
  templateUrl: './example-view.component.html',
  styleUrls: ['./example-view.component.scss']
})
@UnRx()
export class ExampleViewComponent extends MarkdownDynamicComponentPortal implements OnDestroy {
  exampleData: LiveExample;
  sourceCode = new BehaviorSubject<ExampleFileAsset[]>(null);

  viewSourceCode = false;

  constructor(private exampleService: MarkdownCodeExamplesService,
              @Inject(EXAMPLE_COMPONENTS_TOKEN) private exampleComponents: {[key: string]: LiveExample} ) {
    super();
    this.containerClass = 'mat-elevation-z7';
  }

  getComponent(selector: string): Type<any> | undefined {
    this.sourceCode.next(null);
    this.exampleData = this.exampleComponents[selector];
    return this.exampleData && this.exampleData.component;
  }

  render(): void {
    super.render();
    this.exampleService.getExample(this.componentName)
      .then( assets => this.sourceCode.next(assets) );
  }

  ngOnDestroy(): void {
    this.sourceCode.complete();
  }
}
