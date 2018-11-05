import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DocsiModule } from '@neg/docsi';
import { SourceCodeComponent, ExampleWithSourceComponent } from './components';


export const ENTRY_COMPONENTS = [
  SourceCodeComponent,
  ExampleWithSourceComponent,
];

export const DECLARATION_EXPORTS = [
  ENTRY_COMPONENTS,
];

@NgModule({
  declarations: [ DECLARATION_EXPORTS ],
  imports: [
    CommonModule,
    FlexModule,
    ExtendedModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatTooltipModule,
    DocsiModule,
  ],
  exports: [ DECLARATION_EXPORTS ],
  entryComponents: ENTRY_COMPONENTS,
})
export class DocsiMaterialSuiteModule { }
