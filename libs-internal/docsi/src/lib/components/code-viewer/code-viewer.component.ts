import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'div[code-viewer]', // tslint:disable-line:component-selector
  host: { // tslint:disable-line:use-host-property-decorator
    '[style.position]': `'relative'`,
  },
  templateUrl: './code-viewer.component.html',
  styleUrls: [ './code-viewer.component.scss' ],
})
export class CodeViewer {
  private textarea: HTMLTextAreaElement;

  constructor(private elRef: ElementRef<HTMLElement>) { }

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
