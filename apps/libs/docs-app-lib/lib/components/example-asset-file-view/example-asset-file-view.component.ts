import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import type { ExampleFileAsset } from '@pebula-internal/webpack-markdown-code-examples';

@Component({
  selector: 'div[exampleAssetFileView]', // tslint:disable-line:component-selector
  host: { // tslint:disable-line:use-host-property-decorator
    '[style.position]': `'relative'`,
  },
  templateUrl: './example-asset-file-view.component.html',
  styleUrls: [ './example-asset-file-view.component.scss' ],
})
export class ExampleAssetFileViewComponent {
  private textarea: HTMLTextAreaElement;

  @Input('exampleAssetFileView') set asset(value : ExampleFileAsset) {
    this.elRef.nativeElement.innerHTML = value.contents;
  };

  @ViewChild('code', { static: true, read: ElementRef }) elRef: ElementRef<HTMLElement>;

  copy() {
    this.copyText(this.elRef.nativeElement.firstElementChild.textContent);
  }

  /** Copy the text value to the clipboard. */
  copyText(text: string): boolean {
    this.createTextareaAndSelect(text);

    const copySuccessful = document.execCommand('copy');
    this.removeFake();

    return copySuccessful;
  }

  /**
   * Creates a hidden textarea element, sets its value from `text` property,
   * and makes a selection on it.
   */
  private createTextareaAndSelect(text: string) {
    // Create a fake element to hold the contents to copy
    this.textarea = document.createElement('textarea');

    // Prevent zooming on iOS
    this.textarea.style.fontSize = '12pt';

    // Hide the element
    this.textarea.classList.add('visually-hidden');

    // Move element to the same position vertically
    const yPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.textarea.style.top = yPosition + 'px';

    this.textarea.setAttribute('readonly', '');
    this.textarea.value = text;

    document.body.appendChild(this.textarea);

    this.textarea.select();
    this.textarea.setSelectionRange(0, this.textarea.value.length);
  }

  /** Remove the text area from the DOM. */
  private removeFake() {
    if (this.textarea) {
      document.body.removeChild(this.textarea);
      this.textarea = null;
    }
  }
}
