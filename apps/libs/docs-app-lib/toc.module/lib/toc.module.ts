import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TocHeadDirective } from './toc-head.directive';
import { TocAreaDirective } from './toc-area.directive';
import { TocComponent } from './toc.component';
import { TocLinkTemplateDirective } from './toc-link-template';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ TocAreaDirective, TocHeadDirective, TocComponent, TocLinkTemplateDirective ],
  exports: [ TocAreaDirective, TocHeadDirective, TocComponent, TocLinkTemplateDirective ],
})
export class PblTocModule { }
