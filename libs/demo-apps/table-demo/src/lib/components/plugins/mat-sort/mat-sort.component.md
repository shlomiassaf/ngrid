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
            [dataSource]="simpleSortDS"
            [columns]="columns">
    <neg-table-paginator *negTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.dataSource.paginator"></neg-table-paginator>
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

<docsi-mat-example-with-source title="Sorting with default active column and direcion" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@neg-example:ex-2-->
  <neg-table matSort matSortActive="name" matSortDirection="desc"
            usePagination
            blockUi
            [dataSource]="defaultSortDS"
            [columns]="columns">
    <neg-table-paginator *negTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.dataSource.paginator"></neg-table-paginator>
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

<docsi-mat-example-with-source title="Programatic Sorting" contentClass="mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@neg-example:ex-3-->
  <neg-table #matSort="negMatSort"
             matSort
             [stickyHeader]="['table']"
             usePagination
             blockUi
             [dataSource]="progSortDS"
             [columns]="columns">
    <neg-table-paginator *negTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.dataSource.paginator"></neg-table-paginator>
  </neg-table>

  <mat-form-field>
    <mat-select #selectColumn>
      <mat-option *ngFor="let o of matSort.table._store.table" [value]="o">{{o.label}}</mat-option>
    </mat-select>
  </mat-form-field>
  <button *ngIf="selectColumn?.selected?.value as c" mat-button
                (click)="toggleActive(matSort, c, $event.checked)">
                {{ inegtive(matSort, c) ? matSort.sort.direction + ':' : 'In' }}Active</button>
  <!--@neg-example:ex-3-->
</docsi-mat-example-with-source>
