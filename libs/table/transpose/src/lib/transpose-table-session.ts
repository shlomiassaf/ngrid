import { Observable, isObservable, of as obsOf, from as obsFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  SgTableColumnDefinitionSet,
  SgTableComponent,
  SgDataSource,
  SgColumn,
  SgDataSourceTriggerChangedEvent,
  KillOnDestroy,
} from '@sac/table';

export const LOCAL_COLUMN_DEF = Symbol('LOCAL_COLUMN_DEF');
export const VIRTUAL_REFRESH = {};

export class TransposeTableSession {
  dsSourceFactory: any;
  ds: SgDataSource<any>;
  columnsInput: SgTableColumnDefinitionSet;
  storeColumns: SgColumn[];
  headerRow: boolean;

  private destroyed: boolean;
  private rawSource: any[];

  constructor(private table: SgTableComponent<any>,
              private updateColumns: () => void,
              private sourceFactoryWrapper: (results: any[]) => any[]) {
    this.init();
    if (table.columns && table._store.table.length > 0) {
      this.onInvalidateHeaders();
    }
    this.onDataSource(this.table.dataSource);
  }

  destroy(updateTable: boolean): void {
    if (!this.destroyed) {
      this.destroyed = true;
      KillOnDestroy.kill(this, this.table);

      this.table.headerRow = this.headerRow;
      this.table.columns = this.columnsInput;
      if (updateTable) {
        this.table.invalidateHeader(true);
        this.table.dataSource.refresh(VIRTUAL_REFRESH);
      }
    }
  }

  private init(): void {
    this.headerRow = this.table.headerRow;
    this.table.headerRow = false;
    this.table.pluginEvents
      .pipe(KillOnDestroy(this, this.table))
      .subscribe( e => e.kind === 'onInvalidateHeaders' && e.rebuildColumns && this.onInvalidateHeaders() );

    this.table.pluginEvents
      .pipe(KillOnDestroy(this, this.table))
      .subscribe( e => e.kind === 'onDataSource' && this.onDataSource(e.curr) );
  }

  private onInvalidateHeaders(): void {
    if (!this.table.columns[LOCAL_COLUMN_DEF]) {
      this.columnsInput = this.table.columns;
      this.storeColumns = this.table._store.table;
      this.updateColumns();
    }
  }

  private onDataSource(ds?: SgDataSource): void {
    this.unPatchDataSource();
    if (ds) {
      this.ds = ds;
      this.dsSourceFactory = ds.adapter.sourceFactory;
      this.ds.adapter.sourceFactory = (event: SgDataSourceTriggerChangedEvent) => {
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
