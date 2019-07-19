import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { PblDemoAppSharedModule } from '@pebula/apps/shared';

@NgModule({
  imports: [
    CommonModule,
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
  ],
  exports: [
    CommonModule,
    FlexModule, ExtendedModule,
    PblDemoAppSharedModule,
  ]
})
export class ExampleCommonModule { }
