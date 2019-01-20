# Mat Sort

```json negCode
[
  {
    "file": "./mat-sort.component.ts",
    "section": "ex-1"
  },
  {
    "section": "ex-1"
  }
]
```

<docsi-mat-example-with-source title="Sorting" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@neg-example:ex-1-->
  <neg-table matSort
             usePagination
             blockUi
             vScrollNone
             fallbackMinHeight="300"
             [dataSource]="simpleSortDS"
             [columns]="columns1">
    <neg-table-paginator *negTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.ds.paginator"></neg-table-paginator>
  </neg-table>
  <!--@neg-example:ex-1-->
</docsi-mat-example-with-source>

```json negCode
[
  {
    "file": "./mat-sort.component.ts",
    "section": "ex-2"
  },
  {
    "section": "ex-2"
  }
]
```

<docsi-mat-example-with-source title="Sorting with default active column and direcion" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@neg-example:ex-2-->
  <neg-table matSort matSortActive="name" matSortDirection="desc"
            blockUi
            [dataSource]="defaultSortDS"
            [columns]="columns">
    <neg-table-paginator *negTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.ds.paginator"></neg-table-paginator>
  </neg-table>
  <!--@neg-example:ex-2-->
</docsi-mat-example-with-source>

```json negCode
[
  {
    "file": "./mat-sort.component.ts",
    "section": "ex-3"
  },
  {
    "section": "ex-3"
  }
]
```

<docsi-mat-example-with-source title="Programatic Sorting" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@neg-example:ex-3-->
  <neg-table #matSort="negMatSort"
             matSort
             [stickyHeader]="['table']"
             blockUi
             [dataSource]="progSortDS"
             [columns]="columns">
    <neg-table-paginator *negTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.ds.paginator"></neg-table-paginator>
  </neg-table>

  <mat-form-field>
    <mat-select #selectColumn>
      <mat-option *ngFor="let o of matSort.table.columnApi.visibleColumns" [value]="o">{{o.label}}</mat-option>
    </mat-select>
  </mat-form-field>
  <button *ngIf="selectColumn?.selected?.value as c" mat-button
                (click)="toggleActive(matSort, c, $event.checked)">
                {{ isActive(matSort, c) ? matSort.sort.direction + ':' : 'In' }}Active</button>
  <!--@neg-example:ex-3-->
</docsi-mat-example-with-source>
