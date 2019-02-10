import { Observable, isObservable, of as obsOf, from as obsFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { UnRx } from '@pebula/utils';
import {
  PblNgridColumnDefinitionSet,
  PblNgridComponent,
  PblNgridPluginController,
  PblDataSource,
  PblColumn,
  PblDataSourceTriggerChangedEvent,
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

  constructor(private table: PblNgridComponent<any>,
              private pluginCtrl: PblNgridPluginController,
              private updateColumns: () => void,
              private sourceFactoryWrapper: (results: any[]) => any[]) {
    this.init();
    if (table.columns && table.columnApi.visibleColumns.length > 0) {
      this.onInvalidateHeaders();
    }
    this.onDataSource(this.table.ds);
  }

  destroy(updateTable: boolean): void {
    if (!this.destroyed) {
      this.destroyed = true;
      UnRx.kill(this, this.table);

      this.table.showHeader = this.headerRow;
      this.table.columns = this.columnsInput;
      if (updateTable) {
        this.table.invalidateColumns();
        this.table.ds.refresh(VIRTUAL_REFRESH);
      }
    }
  }

  private init(): void {
    this.headerRow = this.table.showHeader;
    this.table.showHeader = false;
    this.pluginCtrl.events
      .pipe(UnRx(this, this.table))
      .subscribe( e => e.kind === 'onInvalidateHeaders' && this.onInvalidateHeaders() );

    this.pluginCtrl.events
      .pipe(UnRx(this, this.table))
      .subscribe( e => e.kind === 'onDataSource' && this.onDataSource(e.curr) );
  }

  private onInvalidateHeaders(): void {
    if (!this.table.columns[LOCAL_COLUMN_DEF]) {
      this.columnsInput = this.table.columns;
      this.storeColumns = this.table.columnApi.visibleColumns;
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
