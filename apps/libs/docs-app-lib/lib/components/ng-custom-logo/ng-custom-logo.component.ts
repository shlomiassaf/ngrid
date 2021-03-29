import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'div[ng-custom-logo]',
  templateUrl: './ng-custom-logo.component.html',
  styleUrls: [ './ng-custom-logo.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgCustomLogoComponent {
  @Input() color: string;
  @Input() set flat(value: boolean) {
    this._flat = coerceBooleanProperty(value);
  }

  _flat: boolean;

  static ngAcceptInputType_flat: BooleanInput;
}
