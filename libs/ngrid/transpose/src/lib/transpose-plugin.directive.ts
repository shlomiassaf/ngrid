import { Directive, Input, OnDestroy } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { UnRx } from '@pebula/utils';
import {
  columnFactory,
  PblNgridConfigService,
  PblColumnDefinition,
  PblNgridColumnDefinitionSet,
  PblNgridComponent,
  PblNgridPluginController,
  PblColumn,
  TablePlugin,
} from '@pebula/ngrid';

import { TransposeTableSession, LOCAL_COLUMN_DEF, VIRTUAL_REFRESH } from './transpose-table-session';
import { getCellValueTransformed, createTransformedColumn } from './utils';

const DEFAULT_HEADER_COLUMN = { prop: '__transpose__', css: 'pbl-ngrid-header-cell pbl-ngrid-transposed-header-cell' };

declare module '@pebula/ngrid/lib/table/services/config' {
  interface PblNgridConfig {
    transposePlugin?: {
      header?: Partial<PblColumnDefinition>;
      defaultCol?: Partial<PblColumnDefinition>;
      matchTemplates?: boolean;
    }
  }
}

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    transpose?: PblNgridTransposePluginDirective;
  }
}
const PLUGIN_KEY: 'transpose' = 'transpose';

/**
 * Transpose plugin.
 *
 * This plugin will swaps around the rows and columns of the table.
 *
 * A **regular table** (not transposed) represents rows horizontally:
 *
 * - Each horizontal row represents an item in the collection.
 * - Each vertical column represents the same property of all rows in the collection.
 *
 * A **transposed** table represents row vertically:
 *
 * - Each horizontal row represents the same property of all rows in the collection.
 * - Each vertical row represents an item in the collection.
 *
 * > Note that transposing a table might not play nice with other plugins and/or features.
 * For example, using pagination with transpose make no sense.
 */

@TablePlugin({ id: PLUGIN_KEY })
@Directive({ selector: 'pbl-ngrid[transpose]' })
@UnRx()
export class PblNgridTransposePluginDirective implements OnDestroy {

  @Input() get transpose(): boolean { return this.enabled; };
  set transpose(value: boolean) {
    value = coerceBooleanProperty(value);
    if (value !== this.enabled) {
      const isFirst = this.enabled === undefined;
      this.enabled = value;
      if (!value) {
        this.disable(true);
      } else {
        this.enable(!isFirst);
      }
    }
  }

  /**
   * Column definitions for the new header column, this is the column the first column that
   * will display all the headers.
   *
   * This is an optional value, when not set a default column settings is used:
   *
   * ```js
   * {
   *  prop: '__transpose__',
   *  css: 'pbl-ngrid-header-cell pbl-ngrid-transposed-header-cell',
   * }
   * ```
   *
   * When set, the new column values will merge into the default definitions, overriding existing properties
   * set on the default column settings.
   *
   * > The header column behave like any other column and you can also provide define it in the `column` property on the table.
   * When using this approach the column defined on the table is used as is (no merging). Just make sure you use the right `prop` value for it.
   * e.g. if `header` is not set here its `__transpose__` otherwise, the actual `prop` value.
   */
  @Input('transposeHeaderCol') set header(value: Partial<PblColumnDefinition>) {
    this._header = Object.assign({}, DEFAULT_HEADER_COLUMN, value || {})
  }

  /**
   * Column definitions to be used as the base default definitions for the new transposed columns.
   * This is an optional value, when not set no default's are applied.
   */
  @Input('transposeDefaultCol') defaultCol: Partial<PblColumnDefinition>;

  /**
   * When true, will try to use the original template of the cell, i.e. the template that would have been used
   * if we did not transpose at all.
   *
   * Defaults to false.
   */
  @Input() matchTemplates: boolean;

  private enabled: boolean;
  private _header: PblColumnDefinition = DEFAULT_HEADER_COLUMN;
  private tableState: TransposeTableSession;
  private columns: PblColumn[];
  private selfColumn: PblColumn;
  private _removePlugin: (table: PblNgridComponent<any>) => void;

  constructor(private table: PblNgridComponent<any>, private pluginCtrl: PblNgridPluginController, config: PblNgridConfigService) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);
    const transposePlugin = config.get('transposePlugin');
    if (transposePlugin) {
      this.header = transposePlugin.header;
      this.defaultCol = transposePlugin.defaultCol || {};
      this.matchTemplates = transposePlugin.matchTemplates || false;
    }
  }

  ngOnDestroy() {
    this._removePlugin(this.table);
    this.disable(false);
  }

  disable(updateTable: boolean): void {
    if (this.tableState) {
      const { tableState } = this;
      this.columns = this.selfColumn = this.tableState = this.columns = this.selfColumn = undefined;
      tableState.destroy(updateTable);
    }
  }

  enable(refreshDataSource: boolean = false): void {
    if (this.tableState) {
      this.disable(false);
    }

    const sourceFactoryWrapper = (results: any[]) => {
      if (results) {
        const local: PblNgridColumnDefinitionSet = this.table.columns = columnFactory()
          .default(this.defaultCol || {})
          .table(
            this.selfColumn,
            ...results.map(createTransformedColumn),
          )
          .build();

        const prev = this.tableState.columnsInput;
        local.header = prev.header;
        local.headerGroup = prev.headerGroup;
        local.footer = prev.footer;
        local[LOCAL_COLUMN_DEF] = true;

        this.table.invalidateColumns();

        const matchTemplates = coerceBooleanProperty(this.matchTemplates);
        const { prop } = this._header;
        const columnKeysToProxy: Array<keyof PblColumn> = ['type'];

        if (matchTemplates) {
          columnKeysToProxy.push('cellTpl');
        }

        /* The following logic is not for the faint of heart.
           Basically, the transpose plugin does not swap the actual data but the columns.
           When transposing, all rows will swap to columns so, A new column definition is created,
           with columns equal to the total number or items in the datasource.
           Each column (new one) represents a row so we save a reference to the actual row in the new column.

           The next step is to create a new datasource, the new datasource is simply a collection of all of the original columns.

           Now when `getValue` is called on the new column it is called with a "row" which is the original column.
           Because the new column has a reference to the actual (original) row we can call the `getValue` on the old column with the actual row.

           In this process, all of the column metadata related to the presentation layer is lost. For example, if CSS classes will
           not be the same, templates, types etc... This is because when the grid renders a cell that cell has a single template across
           all rows but now we need a different template for every row.

           We can proxy a (VERY) limited set of metadata properties related to the presentation layer, valid only on render time.
           This relays on the fact that each row is rendered complete, starting from the first cell to the last so
           with that we can get a reference to the original column tha that now represents the whole row.
         */
        let currentColumn: PblColumn;
        for (const c of this.table.columnApi.visibleColumns) {
          if (c.orgProp === prop) {
            c.getValue = (row: PblColumn) => {
              currentColumn = row;
              return row.label as any;
            };
          } else {
            c.getValue = getCellValueTransformed;
            for (const key of columnKeysToProxy) {
              Object.defineProperty(c, key, { get: () => currentColumn && currentColumn[key], set: value => {} });
            }
          }
        }
        return this.columns;
      }
      return results;
    };

    this.tableState = new TransposeTableSession(
      this.table,
      this.pluginCtrl,
      () => this.updateColumns(this.table.columnApi.visibleColumns),
      sourceFactoryWrapper,
    );

    if (refreshDataSource) {
      this.pluginCtrl.extApi.contextApi.clear();
      this.table.ds.refresh();
    } else if (this.table.ds.length > 0) {
      this.table.ds.refresh(VIRTUAL_REFRESH);
    }
  }

  private updateColumns(columns: PblColumn[]): void {
    const { prop } = this._header;
    this.columns = [];
    for (const c of columns) {
      if (c.orgProp === prop) {
        this.selfColumn = c;
      } else {
        this.columns.push(c);
      }
    }
    if (!this.selfColumn) {
      // TODO: don't assume columns[0]
      this.selfColumn = new PblColumn(this._header, this.pluginCtrl.extApi.columnStore.groupStore);
    }
  }
}
