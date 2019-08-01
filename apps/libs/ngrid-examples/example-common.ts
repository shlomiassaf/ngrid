import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { PblDemoAppSharedModule } from '@pebula/apps/shared';

@NgModule({
  imports: [
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
  ],
  exports: [
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
  ]
})
export class ExampleCommonModule { }
