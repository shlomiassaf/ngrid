import { Directive, Input, ElementRef } from '@angular/core';
import { StylingDiffer, StylingDifferOptions } from './styling_differ';

/*
    We're using `StylingDiffer`, which is an exact copy of the style differ used for `ngStyle` and `ngClass`.
    The class is not exposed so we use a hard-copy.
    `StylingDiffer` is used only when IVY is enabled but here we've adopted it to be used in both modes. (pre IVY and IVY)
*/


/**
 * Bind to the class / style attributes of the container of a cell template.
 * For class bindings use [ngridCellClass] and for style bindings use [ngridCellStyle].
 *
 * This is like [ngClass] or [ngStyle] but not for the host of the directive but to it's parent.
 *
 * - [ngridCellClass] accepts the same type of values that [ngClass] does.
 * - [ngridCellStyle] accepts the same type of values that [ngStyle] does.
 *
 * ## Example
 *
 * We want to create a new cell type called "balance" that represents the balance of a bank account.
 * We also want to have different background color, green if the account balance if positive and red if it's negative.
 *
 * ```html
 * <div *pblNgridCellTypeDef="'balance'; value as value"
 *      [ngClass]="value < 0 ? 'balance-negative' : 'balance-positive'">{{ value  }}
 * </div>
 * ```
 *
 * The example above will work but the background will not fill the entire cell, only the `div` it is applied on.
 * This is because the container of the `div` has internal styling that apply padding (among other styles) to the cell.
 *
 * The container is controlled internally by ngrid, but you can access it's style / class attributes using this directive.
 *
 * ```html
 * <div *pblNgridCellTypeDef="'balance'; value as value"
 *      [ngridCellClass]="value < 0 ? 'balance-negative' : 'balance-positive'">{{ value  }}
 * </div>
 * ```
 *
 * > Because style / class is applied on the parent and the parent can have multiple children it is possible to apply this directive
 * on multiple children, do not do this as it will have unexpected results.
 */
@Directive({ selector: '[ngridCellStyle], [ngridCellClass]' })
export class PblNgridCellStyling {

  @Input('ngridCellStyle') set style(value: { [key: string]: string }) {
    if (!this._styleDiffer) {
      this._styleDiffer = new StylingDiffer<{ [key: string]: any } | null>('NgStyle', StylingDifferOptions.AllowUnits);
    }
    this._styleDiffer.setValue(value);
  }

  @Input('ngridCellClass') set klass(value: string | string[] | Set<string> | { [klass: string]: any }) {
    if (!this._classDiffer) {
      this._classDiffer = new StylingDiffer<{ [klass: string]: boolean }>(
        'NgClass',
        StylingDifferOptions.TrimProperties | StylingDifferOptions.AllowSubKeys | StylingDifferOptions.AllowStringValue | StylingDifferOptions.ForceAsMap,
      );
    }
    this._classDiffer.setValue(value);
  }

  private _styleDiffer: StylingDiffer<{ [key: string]: any } | null>;
  private _classDiffer: StylingDiffer<{ [klass: string]: boolean }>;
  private _parent: HTMLElement;
  private _lastStyle = new Set<string>();
  private _lastClass = new Set<string>();

  constructor(private elRef: ElementRef<HTMLElement>) { }

  ngAfterViewInit(): void {
    this._parent = this.elRef.nativeElement.parentElement;
    this.updateParent();
  }

  ngDoCheck(): void { this,this.updateParent(); }

  private updateParent(): void {
    if (this._parent) {
      if (this._styleDiffer && this._styleDiffer.hasValueChanged()) {
        const lastStyle = this._lastStyle;
        this._lastStyle = new Set<string>();
        for (const key of Object.keys(this._styleDiffer.value)) {
          this._parent.style[key] = this._styleDiffer.value[key];
          lastStyle.delete(key);
          this._lastStyle.add(key);
        }
        if (lastStyle.size > 0) {
          for (const key of lastStyle.values()) {
            this._parent.style[key] = null;
          }
        }
      }

      if (this._classDiffer && this._classDiffer.hasValueChanged()) {
        const lastClass = this._lastClass;
        this._lastClass = new Set<string>();
        for (const key of Object.keys(this._classDiffer.value)) {
          if (this._classDiffer.value[key]) {
            this._parent.classList.add(key);
            this._lastClass.add(key);
          } else {
            this._parent.classList.remove(key);
          }
          lastClass.delete(key);
        }
        if (lastClass.size > 0) {
          for (const key of lastClass.values()) {
            this._parent.classList.remove(key);
          }
        }
      }
    }
  }
}
