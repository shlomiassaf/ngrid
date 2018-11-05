import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ExampleCodeContainerComponent,
  BtCompileMarkdownComponent,
  BtSourceCodeRefComponent,
  CodeViewer,
} from './components';

export const ENTRY_COMPONENTS = [
  ExampleCodeContainerComponent,
  BtCompileMarkdownComponent,
  BtSourceCodeRefComponent,
];

export const DECLARATION_EXPORTS = [
  ENTRY_COMPONENTS,
  CodeViewer,
];

@NgModule({
  declarations: [ DECLARATION_EXPORTS ],
  imports: [
    CommonModule,
  ],
  exports: [ DECLARATION_EXPORTS ],
  entryComponents: ENTRY_COMPONENTS,
})
export class DocsiModule { }
