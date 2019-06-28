import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';

@NgModule({
  imports: [
    CommonModule,
    FlexModule, ExtendedModule,
  ],
  exports: [
    CommonModule,
    FlexModule, ExtendedModule,
  ]
})
export class ExampleCommonModule { }
