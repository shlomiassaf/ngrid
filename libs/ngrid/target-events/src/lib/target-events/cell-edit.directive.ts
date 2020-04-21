import { Directive, Input, Injector, OnDestroy } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { PblNgridComponent, PblNgridPluginController, utils } from '@pebula/ngrid';
import { PblNgridTargetEventsPlugin } from './target-events-plugin';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'pbl-ngrid[cellEditClick], pbl-ngrid[cellEditDblClick]',
})
export class PblNgridCellEditDirective<T> implements OnDestroy {
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

  constructor(grid: PblNgridComponent<any>, injector: Injector, pluginCtrl: PblNgridPluginController) {

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

  ngOnDestroy(): void {
    utils.unrx.kill(this);
  }

  private update(): void {
    if (this.targetEventsPlugin) {
      utils.unrx.kill(this, this.targetEventsPlugin);
      if (this._click) {
        this.targetEventsPlugin.cellClick
          .pipe(utils.unrx(this, this.targetEventsPlugin))
          .subscribe( event => {
            if (event.type === 'data' && event.column.editable) {
              event.context.startEdit(true);
            }
          });
      }

      if (this._dblClick) {
        this.targetEventsPlugin.cellDblClick
          .pipe(utils.unrx(this, this.targetEventsPlugin))
          .subscribe( event => {
            if (event.type === 'data' && event.column.editable) {
              event.context.startEdit(true);
            }
          });
      }
    }
  }
}
