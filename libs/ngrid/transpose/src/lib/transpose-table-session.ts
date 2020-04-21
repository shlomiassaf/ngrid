import { Observable, isObservable, of as obsOf, from as obsFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  PblNgridColumnDefinitionSet,
  PblNgridComponent,
  PblNgridPluginController,
  PblDataSource,
  PblColumn,
  PblDataSourceTriggerChangedEvent,
  utils,
} from '@pebula/ngrid';

export const LOCAL_COLUMN_DEF = Symbol('LOCAL_COLUMN_DEF');
export const VIRTUAL_REFRESH = {};

export class TransposeTableSession {
  dsSourceFactory: any;
  ds: PblDataSource<any>;
  columnsInput: PblNgridColumnDefinitionSet;
  storeColumns: PblColumn[];
  headerRow: boolean;

  private destroyed: boolean;
  private rawSource: any[];

  constructor(private grid: PblNgridComponent<any>,
              private pluginCtrl: PblNgridPluginController,
              private updateColumns: () => void,
              private sourceFactoryWrapper: (results: any[]) => any[]) {
    this.init();
    if (grid.columns && grid.columnApi.visibleColumns.length > 0) {
      this.onInvalidateHeaders();
    }
    this.onDataSource(this.grid.ds);
  }

  destroy(updateTable: boolean): void {
    if (!this.destroyed) {
      this.destroyed = true;
      utils.unrx.kill(this, this.grid);

      this.grid.showHeader = this.headerRow;
      this.grid.columns = this.columnsInput;
      if (updateTable) {
        this.grid.invalidateColumns();
        this.grid.ds.refresh(VIRTUAL_REFRESH);
      }
    }
  }

  private init(): void {
    this.headerRow = this.grid.showHeader;
    this.grid.showHeader = false;
    this.pluginCtrl.events
      .pipe(utils.unrx(this, this.grid))
      .subscribe( e => e.kind === 'onInvalidateHeaders' && this.onInvalidateHeaders() );

    this.pluginCtrl.events
      .pipe(utils.unrx(this, this.grid))
      .subscribe( e => e.kind === 'onDataSource' && this.onDataSource(e.curr) );
  }

  private onInvalidateHeaders(): void {
    if (!this.grid.columns[LOCAL_COLUMN_DEF]) {
      this.columnsInput = this.grid.columns;
      this.storeColumns = this.grid.columnApi.visibleColumns;
      this.updateColumns();
    }
  }

  private onDataSource(ds?: PblDataSource): void {
    this.unPatchDataSource();
    if (ds) {
      this.ds = ds;
      this.dsSourceFactory = ds.adapter.sourceFactory;
      this.ds.adapter.sourceFactory = (event: PblDataSourceTriggerChangedEvent) => {
        const rawSource = event.data.changed && event.data.curr === VIRTUAL_REFRESH
          ? this.ds.source
          : this.dsSourceFactory(event)
        ;

        if (rawSource === false) {
          return rawSource;
        } else if (this.destroyed) {
          this.unPatchDataSource();
          return this.rawSource;
        }

        const obs: Observable<any[]> = isObservable(rawSource)
          ? rawSource
          : Array.isArray(rawSource) ? obsOf<any>(rawSource) : obsFrom(rawSource) // promise...
        ;
        return obs
          .pipe(
            tap( source => this.rawSource = source ),
            map(this.sourceFactoryWrapper),
          );
      }
    }
  }

  private unPatchDataSource(): void {
    if (this.ds) {
      this.ds.adapter.sourceFactory = this.dsSourceFactory;
      this.ds = this.dsSourceFactory = undefined;
    }
  }
}
