import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pbl-the-registry-grid-example-component',
  templateUrl: './the-registry.component.html',
  styleUrls: ['./the-registry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheRegistryGridExampleComponent { }
