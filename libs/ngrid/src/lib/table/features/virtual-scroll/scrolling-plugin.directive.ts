import { Directive, EventEmitter, Output, NgZone } from '@angular/core';
import { PblNgridPluginController } from '../../../ext/plugin-control';
import { PblNgridComponent } from '../../table.component';

@Directive({
  selector: 'pbl-ngrid[scrolling]'
})
export class PblNgridScrolling<T = any> {

  /**
   * Event emitted when the scrolling state of rows in the table changes.
   * When scrolling starts `true` is emitted and when the scrolling ends `false` is emitted.
   *
   * The table is in "scrolling" state from the first scroll event and until 2 animation frames
   * have passed without a scroll event.
   *
   * When scrolling, the emitted value is the direction: -1 or 1
   * When not scrolling, the emitted value is 0.
   *
   * NOTE: This event runs outside the angular zone.
   */
  @Output() scrolling = new EventEmitter< -1 | 0 | 1 >();

  constructor(table: PblNgridComponent<T>, pluginCtrl: PblNgridPluginController, zone: NgZone) {
    let subscription = pluginCtrl.events.subscribe( event => {
      if (event.kind === 'onInit') {
        const { viewport } = table;
        if (viewport) {
          viewport.scrolling.subscribe( isScrolling => zone.run( () => this.scrolling.next(isScrolling) ) );
        }
        subscription.unsubscribe();
        subscription = undefined;
      }
    });
  }
}
