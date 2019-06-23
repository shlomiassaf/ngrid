<pbl-ngrid id="sellers"
           identityProp="id" persistState rowReorder columnReorder
           blockUi
           matSort vScrollFixed
           cellTooltip
           focusMode="cell"
           matCheckboxSelection="selection"
           [stickyHeader]="['table']"
           [dataSource]="dataSource"
           [columns]="columns"
           (cellClick)="$event.context && $event.context.startEdit()"
           style="height: 500px"
           class=" pbl-ngrid-cell-ellipsis pbl-ngrid-header-cell-ellipsis">
  <pbl-demo-action-row filter label="Sellers" (refresh)="refresh()" ></pbl-demo-action-row>
  <div *pblNgridCellTypeDef="'countryNameDynamic'; col as col; row as row">{{ col.type.data.name(row) }}</div>

  <div *pblNgridHeaderExtensionRef="let ctx" style="position: absolute; right: 0; height: 100%; cursor: pointer; margin-right: 12px; z-index: 50000"
      [matMenuTriggerFor]="columnMenu" [matMenuTriggerData]="ctx" fxLayoutAlign="center center">
    <mat-icon style="height: 16px; width: 16px; font-size: 16px; line-height: 16px;">more_vert</mat-icon>
  </div>
  <mat-menu #columnMenu="matMenu">
    <ng-template matMenuContent let-ctx>
      <button mat-menu-item (click)="ctx.table.columnApi.autoSizeColumn(ctx.col)">Auto Fit</button>
      <button mat-menu-item [matMenuTriggerFor]="columnSortMenu" [matMenuTriggerData]="ctx" [disabled]="!ctx.col.sort">Sort</button>
      <button mat-menu-item [matMenuTriggerFor]="columnPinMenu" [matMenuTriggerData]="ctx">Pin</button>
    </ng-template>
  </mat-menu>
  <mat-menu #columnSortMenu="matMenu">
    <ng-template matMenuContent let-ctx>
      <button mat-menu-item (click)="ctx.table.ds.setSort()">None</button>
      <button mat-menu-item (click)="ctx.table.ds.setSort(ctx.col, { order: 'asc' })">Asc</button>
      <button mat-menu-item (click)="ctx.table.ds.setSort(ctx.col, { order: 'desc' })">Desc</button>
    </ng-template>
  </mat-menu>
  <mat-menu #columnPinMenu="matMenu">
    <ng-template matMenuContent let-ctx>
      <button mat-menu-item (click)="ctx.col.columnDef.updatePin()">Unpin</button>
      <button mat-menu-item (click)="ctx.col.columnDef.updatePin('start')">Pin Start</button>
      <button mat-menu-item (click)="ctx.col.columnDef.updatePin('end')">Pin End</button>
    </ng-template>
  </mat-menu>
  <div *pblNgridHeaderCellTypeDef="'pbl-groupby-row'; col as col; table as table" pblAggregationContainer #agg="pblAggregationContainer"
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
</pbl-ngrid>
