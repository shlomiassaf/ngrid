import { Component, Input, ChangeDetectionStrategy, Optional, Inject, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';

import { ExampleCodeContainerComponent, ExtractedCodeGroup, ExtractedCodeQuery } from '@pebula-internal/docsi';

export interface CodeViewItem {
  file?: string;
  title?: string;
  code: string;
  lang: 'ts' | 'html' | 'css' | 'scss';
}

@Component({
  selector: 'docsi-mat-source-code',
  templateUrl: './source-code.component.html',
  styleUrls: [ './source-code.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceCodeComponent implements OnChanges {

  constructor(@Optional() @Inject(ExampleCodeContainerComponent) container: ExampleCodeContainerComponent, private cdr: ChangeDetectorRef) {
    if (container) {
      container.compiledCode.subscribe( cc => {
        this.extractedCodeGroup = cc;
        this.update();
      });
    }
  }

  @Input() set query(value: ExtractedCodeQuery[] | string) {
   this._query = typeof value === 'string'
      ? Function(`"use strict"; return (${value});`)()
      : Array.isArray(value) ? value : []
    ;
  }

  @Input() extractedCodeGroup: ExtractedCodeGroup;

  code: CodeViewItem | CodeViewItem[];
  multi: boolean;

  _query: ExtractedCodeQuery[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.compiledCode || changes.query) {
      this.update();
    }
  }

  private update(): void {
    if (this.extractedCodeGroup && this.extractedCodeGroup.code.length > 0) {
      this.code = this._query && this._query.length > 0
        ? this.extractedCodeGroup.filter(this._query).code
        : this.extractedCodeGroup.code
      ;
    } else {
      this.code = [];
    }

    this.multi = this.code.length > 0;

    // we need timeout because ngOnChanges call's this method
    // and on the initial change the instance is still not set (of the component) so we get an error.
    setTimeout(() => {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, 16);
  }
}
