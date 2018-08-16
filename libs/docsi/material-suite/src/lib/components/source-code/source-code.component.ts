import { Component, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';

import { ExtractedCodeGroup, ExtractedCodeQuery } from '@sac/docsi';

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

  constructor(private cdr: ChangeDetectorRef) {}

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
      if (this.extractedCodeGroup && this.extractedCodeGroup.code.length > 0) {
        this.code = this._query && this._query.length > 0
          ? this.extractedCodeGroup.filter(this._query).code
          : this.extractedCodeGroup.code
        ;
      } else {
        this.code = [];
      }

      this.multi = this.code.length > 0;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }
}
