import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';

import { DocsiModule } from '@neg/docsi';
import { DocsiTocModule } from '@neg/docsi/toc';
import { DocsiMaterialSuiteModule } from '@neg/docsi/material-suite';

import { ExampleGroupComponent } from './example-group';


export const IMPORTS_EXPORTS = [
  CommonModule,
  ReactiveFormsModule,
  FlexModule,
  ExtendedModule,
  RouterModule,
  DocsiModule,
  DocsiTocModule,
  DocsiMaterialSuiteModule
];

export const ENTRY_COMPONENTS = [
  ExampleGroupComponent,
];

export const DECLARATION_EXPORTS = [
  ENTRY_COMPONENTS,
];

/*
    DO NOT EXPORT MATERIAL MODULES.
    LET EACH EXAMPLE MODULE IMPORT IT'S OWN TO MAKE SURE LIBRARIES ONLY NEED WHAT THEY NEED
    AND NOTHING GETS IN
*/

@NgModule({
  declarations: [ DECLARATION_EXPORTS ],
  imports: [
    IMPORTS_EXPORTS,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  exports: [IMPORTS_EXPORTS, DECLARATION_EXPORTS],
  entryComponents: ENTRY_COMPONENTS
})
export class SharedModule { }
