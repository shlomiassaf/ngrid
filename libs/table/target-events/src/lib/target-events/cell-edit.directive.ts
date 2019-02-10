import { Directive, Input, Injector } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { UnRx } from '@pebula/utils';
import { PblColumn, PblNgridComponent, PblNgridPluginController } from '@pebula/table';
import { PblNgridTargetEventsPlugin } from './target-events-plugin';

PblColumn.extendProperty('editable');

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'pbl-ngrid[cellEditClick], pbl-ngrid[cellEditDblClick]',
})
@UnRx()
export class PblNgridCellEditDirective<T> {
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
  private targetEventsPlugin: PblNgridTargetEventsPlugin<T>;

  constructor(table: PblNgridComponent<any>, injector: Injector, pluginCtrl: PblNgridPluginController) {

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
