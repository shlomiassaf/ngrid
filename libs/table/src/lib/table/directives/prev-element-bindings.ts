import { Directive, ElementRef, Input, IterableDiffers, KeyValueDiffers, Renderer2 } from '@angular/core';
import { NgStyle, NgClass } from '@angular/common';

/**
 * Returns true if it is a DOM element
 */
const isHTMLElement = typeof HTMLElement !== 'undefined'
  ? obj => obj instanceof HTMLElement
  : obj => typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string'
;


// TODO: allow parent extraction for other environments?
class PreviousElementRef extends ElementRef<HTMLElement> {
  get nativeElement(): HTMLElement { return this._htmlEl.parentElement || this._htmlEl; }
  set nativeElement(value: HTMLElement) { this._htmlEl = value; }

  private _htmlEl: HTMLElement;

  private constructor(_htmlEl: HTMLElement) { super(_htmlEl); }

  static create<T>(elRef: ElementRef<T>): ElementRef<T> {
    return isHTMLElement(elRef.nativeElement)
      ? new PreviousElementRef(elRef.nativeElement as any) as any
      : elRef
    ;
  }
}

/**
 * Update an HTML element styles on the parent of the HTML element it is applied on.
 *
 * Or, in other words: `NgStyle` for the parent element... this directive does exactly the same thing that `NgStyle` does but on the parent element.
 *
 * In the following HTML code:
 *
 * ```
 *   <div>
 *     <some-element [parentNgStyle]="{'width': '18px'}">...</some-element>
 *   </div>
 * ```
 *
 * The result, after rendering, will have the style `width` with value `18ox` in the parent element `div`.
 *
 * ```
 *   <div style="width: 18px">
 *     <some-element>...</some-element>
 *   </div>
 * ```
 *
 * > All of the inputs that `ngStyle` accepts are valid inputs for `parentNgStyle`
 *
 * > Multiple sessions (i.e. div element with multiple children that have `parentNgStyle`) are not supported at the moment
 */
@Directive({ selector: '[parentNgStyle]' })
export class ParentNgStyleDirective extends NgStyle {

  @Input() set parentNgStyle(values: {[key: string]: string}) { this.ngStyle = values; }

  constructor(_differs: KeyValueDiffers, _ngEl: ElementRef<HTMLElement>, _renderer: Renderer2) {
    super(_differs, PreviousElementRef.create(_ngEl), _renderer);
  }
}

/**
 * Adds and removes CSS classes on the parent of the HTML element it is applied on.
 *
 * Or, in other words: `NgClass` for the parent element... this directive does exactly the same thing that `NgClass` does but on the parent element.
 *
 * In the following HTML code:
 *
 * ```
 *   <div>
 *     <some-element [parentNgClass]="{'first': true, 'second': true, 'third': false}">...</some-element>
 *   </div>
 * ```
 *
 * The result, after rendering, will have the CSS classes `first` and `second` in the parent element `div`.
 *
 * ```
 *   <div class="first second">
 *     <some-element>...</some-element>
 *   </div>
 * ```
 *
 * > All of the inputs that `ngClass` accepts are valid inputs for `parentNgClass`
 *
 * > Multiple sessions (i.e. div element with multiple children that have `parentNgClass`) are not supported at the moment
 */
@Directive({
  selector: '[parentNgClass]',
})
export class ParentNgClassDirective extends NgClass {

  @Input('class') set klass(value: string) { };
  @Input() set parentNgClass(value: string|string[]|Set<string>|{[klass: string]: any}) { this.ngClass = value; };

  constructor(_iterableDiffers: IterableDiffers, _keyValueDiffers: KeyValueDiffers, _ngEl: ElementRef<HTMLElement>, _renderer: Renderer2) {
    super(_iterableDiffers, _keyValueDiffers, PreviousElementRef.create(_ngEl), _renderer);
  }
}
