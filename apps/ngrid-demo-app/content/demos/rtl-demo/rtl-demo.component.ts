import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-rtl-demo-example',
  templateUrl: './rtl-demo.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-rtl-demo-example', { title: 'Rtl Demo' })
export class RtlDemoExample {
  constructor() { }
}
