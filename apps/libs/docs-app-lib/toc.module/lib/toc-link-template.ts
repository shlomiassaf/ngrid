import { Directive, TemplateRef } from '@angular/core';

import { TocComponent, TocLinkTemplateContext } from './toc.component';

@Directive({
  selector: '[pblContentTocLinkTemplate]'
})
export class TocLinkTemplateDirective {
  constructor(tocComponent: TocComponent, template: TemplateRef<TocLinkTemplateContext>) {
    tocComponent.setLinkTemplate(template);
  }
}
