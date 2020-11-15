import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { PblDocsAppSharedModule } from '@pebula/apps/docs-app-lib';

@NgModule({
  imports: [
    FlexModule, ExtendedModule,
    PblDocsAppSharedModule,
  ],
  exports: [
    FlexModule, ExtendedModule,
    PblDocsAppSharedModule,
  ]
})
export class ExampleCommonModule { }
