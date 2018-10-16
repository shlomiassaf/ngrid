# Block UI

i> Block

w> Block

e> Block

I> Block

W> Block

E> Block

```json sacCode
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

<docsi-mat-example-with-source title="Automatic UI block" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@sac-example:ex-1-->
  <sg-table blockUi
            [dataSource]="autoDataSource"
            [columns]="columns">
  </sg-table>
  <button mat-button (click)="refresh()">Refresh</button>
  <!--@sac-example:ex-1-->
</docsi-mat-example-with-source>

```json sacCode
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

<docsi-mat-example-with-source title="Manual UI block" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@sac-example:ex-2-->
  <sg-table #tbl
            #blockUi="blockUi"
            blockUi="false"
            [dataSource]="manualDataSource"
            [columns]="columns">
  </sg-table>
  <button mat-button (click)="tbl.plugin('blockUi').blockUi = !tbl.plugin('blockUi').blockUi">Toggle Block UI (plugin interface)</button>
  <button mat-button (click)="blockUi.blockUi = !blockUi.blockUi">Toggle Block UI (plugin instance)</button>
  <!--@sac-example:ex-2-->
</docsi-mat-example-with-source>
