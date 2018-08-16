import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewContainerRef,
} from '@angular/core';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { CDK_ROW_TEMPLATE, CdkRow } from '@angular/cdk/table';

import { SgTableComponent } from '@sac/table';
import { SgTableDetailRowPluginDirective } from './detail-row-plugin';

@Component({
  selector: 'sg-table-row[detailRow]',
  template: CDK_ROW_TEMPLATE,
  host: {
    'class': 'sg-table-row sg-row-detail-parent',
    'role': 'row',
    '[attr.tabindex]': 'table?.rowFocus',
    '(click)': 'toggle()',
    '(keydown)': 'handleKeydown($event)'
  },
  providers: [
    { provide: CdkRow, useExisting: SgTableDetailRowComponent }
  ],
  exportAs: 'sgTableDetailRow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SgTableDetailRowComponent extends CdkRow implements OnInit, OnDestroy {

  get expended(): boolean {
    return this.opened;
  }

  @Input('detailRow') row: any;
  @Input() table: SgTableComponent<any>;

  private get _element(): HTMLElement { return this.elRef.nativeElement; }
  private opened: boolean = false;

  constructor(private vcRef: ViewContainerRef, private elRef: ElementRef) {
    super();
  }

  ngOnInit(): void {
    SgTableDetailRowPluginDirective.get(this.table).addDetailRow(this);
  }

  ngOnDestroy(): void {
    SgTableDetailRowPluginDirective.get(this.table).removeDetailRow(this);
  }

  toggle(forceState?: boolean): void {
    if (this.opened !== forceState) {
      if ( this.opened ) {
        this.vcRef.clear();
        this._element.classList.remove('sg-row-detail-opened');
      } else {
        this.render();
      }
      this.opened = this.vcRef.length > 0;

      if (this.opened) {
        this._element.classList.add('sg-row-detail-opened');
      }
      this.table.toggleChange.emit(this);
    }
  }

  /**
   * @internal
   */
  handleKeydown(event: KeyboardEvent): void {
    if ( event.target === this._element ) {
      const keyCode = event.keyCode;
      const isToggleKey = keyCode === ENTER || keyCode === SPACE;
      if ( isToggleKey ) {
        event.preventDefault(); // prevents the page from scrolling down when pressing space
        this.toggle();
      }
    }
  }

  private render(): void {
    this.vcRef.clear();
    if (this.row) {
      const detailRowDef = this.table.registry.getSingle('detailRow');
      if ( detailRowDef ) {
        this.vcRef.createEmbeddedView(detailRowDef.tRef, { $implicit: this.row });
      }
    }
  }
}
