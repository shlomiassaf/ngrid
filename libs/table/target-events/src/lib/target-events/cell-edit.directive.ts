import { Directive, Input, Injector } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { UnRx } from '@pebula/utils';
import { NegColumn, NegTableComponent, NegTablePluginController } from '@pebula/table';
import { NegTableTargetEventsPlugin } from './target-events-plugin';

NegColumn.extendProperty('editable');

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'pbl-table[cellEditClick], pbl-table[cellEditDblClick]',
})
@UnRx()
export class NegTableCellEditDirective<T> {
  @Input() set cellEditClick(value: boolean) {
    value = coerceBooleanProperty(value);
    if (this._click !== value) {
      this._click = value;
      this.update();
    }
  }
  @Input() set cellEditDblClick(value: boolean) {
    value = coerceBooleanProperty(value);
    if (this._dblClick !== value) {
      this._dblClick = value;
      this.update();
    }
  }

  private _click = false;
  private _dblClick = false;
  private targetEventsPlugin: NegTableTargetEventsPlugin<T>;

  constructor(table: NegTableComponent<any>, injector: Injector, pluginCtrl: NegTablePluginController) {

    let subscription = pluginCtrl.events.subscribe( event => {
      if (event.kind === 'onInit') {
        subscription.unsubscribe();
        subscription = undefined;

        // Depends on target-events plugin
        // if it's not set, create it.
        this.targetEventsPlugin = pluginCtrl.getPlugin('targetEvents') || pluginCtrl.createPlugin('targetEvents');
        this.update();
      }
    });
  }

  private update(): void {
    if (this.targetEventsPlugin) {
      UnRx.kill(this, this.targetEventsPlugin);
      if (this._click) {
        this.targetEventsPlugin.cellClick
          .pipe(UnRx(this, this.targetEventsPlugin))
          .subscribe( event => {
            if (event.type === 'data' && event.column.editable) {
              event.context.startEdit(true);
            }
          });
      }

      if (this._dblClick) {
        this.targetEventsPlugin.cellDblClick
          .pipe(UnRx(this, this.targetEventsPlugin))
          .subscribe( event => {
            if (event.type === 'data' && event.column.editable) {
              event.context.startEdit(true);
            }
          });
      }
    }
  }
}
