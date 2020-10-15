import { Directive, Input, DoCheck, IterableDiffer, IterableDiffers } from '@angular/core';
import { PblNgridPluginController } from '../../ext/plugin-control';
import { PblColumnStore } from '../column-management';

@Directive({
  selector: 'pbl-ngrid[hideColumns]'
})
export class PblNgridHideColumns implements DoCheck {

  @Input('hideColumns') set hideColumns(value: string[]) {
    this.hidden = value;
    this.dirty = true;
  }

  private dirty: boolean;
  private hidden: string[];
  private differ: IterableDiffer<string>;
  private readonly columnStore: PblColumnStore;

  constructor(private readonly pluginCtrl: PblNgridPluginController, private readonly differs: IterableDiffers) {
    this.columnStore = pluginCtrl.extApi.columnStore;
  }

  ngDoCheck(): void {
    if (this.dirty) {
      this.dirty = false;
      const value = this.hidden;
      if (!this.differ && value) {
        try {
          this.differ = this.differs.find(value).create();
        } catch (e) {
          throw new Error(`Cannot find a differ supporting object '${value}. hideColumns only supports binding to Iterables such as Arrays.`);
        }
      }
    }
    if (this.differ) {
      const hideColumns = this.hidden || [];
      const changes = this.differ.diff(hideColumns);
      if (changes) {
        const hide: string[] = [];
        const show: string[] = [];
        changes.forEachOperation((record, previousIndex, currentIndex) => {
          if (record.previousIndex == null) {
            hide.push(record.item);
          } else if (currentIndex == null) {
            show.push(record.item);
          }
        });
        this.columnStore.updateColumnVisibility(hide, show);
      }
      if (!this.hidden) {
        this.differ = undefined;
      }
    }
  }
}
