# Mat Sort

```json sacCode
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
  <!--@sac-example:ex-1-->
  <sg-table matSort
            usePagination
            blockUi
            [dataSource]="simpleSortDS"
            [columns]="columns"
            style="height: 40%"
            class="sg-boxed-table">
    <sg-table-paginator *sgTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.dataSource.paginator"></sg-table-paginator>
  </sg-table>
  <!--@sac-example:ex-1-->
</docsi-mat-example-with-source>

```json sacCode
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
  <!--@sac-example:ex-2-->
  <sg-table matSort matSortActive="name" matSortDirection="desc"
            usePagination
            blockUi
            [dataSource]="defaultSortDS"
            [columns]="columns"
            style="height: 40%"
            class="sg-boxed-table">
    <sg-table-paginator *sgTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.dataSource.paginator"></sg-table-paginator>
  </sg-table>
  <!--@sac-example:ex-2-->
</docsi-mat-example-with-source>

```json sacCode
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
  <!--@sac-example:ex-3-->
  <sg-table #matSort="sgMatSort"
            matSort
            [stickyHeader]="['table']"
            usePagination
            blockUi
            [dataSource]="progSortDS"
            [columns]="columns"
            style="height: 40%"
            class="sg-boxed-table">
    <sg-table-paginator *sgTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.dataSource.paginator"></sg-table-paginator>
  </sg-table>

  <mat-form-field>
    <mat-select #selectColumn>
      <mat-option *ngFor="let o of matSort.table._store.table" [value]="o">{{o.label}}</mat-option>
    </mat-select>
  </mat-form-field>
  <button *ngIf="selectColumn?.selected?.value as c" mat-button
                (click)="toggleActive(matSort, c, $event.checked)">
                {{ isActive(matSort, c) ? matSort.sort.direction + ':' : 'In' }}Active</button>
  <!--@sac-example:ex-3-->
</docsi-mat-example-with-source>
