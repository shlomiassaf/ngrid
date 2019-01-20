<neg-table identityProp="id" rowReorder columnReorder
           blockUi
           matSort vScrollFixed
           cellTooltip
           matCheckboxSelection="selection"
           [stickyHeader]="['table']"
           [dataSource]="dataSource"
           [columns]="columns"
           (cellClick)="$event.context && $event.context.startEdit()"
           style="height: 500px"
           class=" neg-table-cell-ellipsis neg-table-header-cell-ellipsis">
  <neg-demo-action-row filter label="Sellers" (refresh)="refresh()" ></neg-demo-action-row>
  <div *negTableCellTypeDef="'countryNameDynamic'; col as col; row as row">{{ col.type.data.name(row) }}</div>

  <div *negTableHeaderCellTypeDef="'neg-groupby-row'; col as col; table as table" negAggregationContainer #agg="negAggregationContainer"
       fxLayoutAlign="start center"
       style="position: absolute; height: 100%; width: 100%;">
    <mat-icon>format_list_bulleted</mat-icon>
    <mat-chip-list>
      <mat-chip *ngFor="let c of table.columnApi.groupByColumns"
                (removed)="table.columnApi.removeGroupBy(c)">
        {{ c.label }}
        <mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip>
      <mat-chip *ngIf="agg.pending">
        {{ agg.pending.label }}
      </mat-chip>
    </mat-chip-list>
    <div *cdkDragPlaceholder></div>
  </div>
</neg-table>
