# Block UI

i> Block

w> Block

e> Block

I> Block

W> Block

E> Block

```json negCode
[
  {
    "file": "./block-ui.component.ts",
    "section": "ex-1"
  },
  {
    "section": "ex-1"
  }
]
```

<docsi-mat-example-with-source title="Automatic UI block" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@neg-example:ex-1-->
  <neg-table blockUi
            [dataSource]="autoDataSource"
            [columns]="columns">
  </neg-table>
  <button mat-button (click)="refresh()">Refresh</button>
  <!--@neg-example:ex-1-->
</docsi-mat-example-with-source>

```json negCode
[
  {
    "file": "./block-ui.component.ts",
    "section": "ex-2"
  },
  {
    "section": "ex-2"
  }
]
```

<docsi-mat-example-with-source title="Manual UI block" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@neg-example:ex-2-->
  <neg-table #tbl
            #blockUi="blockUi"
            blockUi="false"
            [dataSource]="manualDataSource"
            [columns]="columns">
  </neg-table>
  <button mat-button (click)="tbl.plugin('blockUi').blockUi = !tbl.plugin('blockUi').blockUi">Toggle Block UI (plugin interface)</button>
  <button mat-button (click)="blockUi.blockUi = !blockUi.blockUi">Toggle Block UI (plugin instance)</button>
  <!--@neg-example:ex-2-->
</docsi-mat-example-with-source>
