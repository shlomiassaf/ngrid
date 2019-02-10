# Block UI

i> Block

w> Block

e> Block

I> Block

W> Block

E> Block

<docsi-mat-example-with-source title="Automatic UI block" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-table blockUi
            [dataSource]="autoDataSource"
            [columns]="columns">
  </pbl-table>
  <button mat-button (click)="refresh()">Refresh</button>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Manual UI block" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-table #tbl
            #blockUi="blockUi"
            blockUi="false"
            [dataSource]="manualDataSource"
            [columns]="columns">
  </pbl-table>
  <button mat-button (click)="tbl.plugin('blockUi').blockUi = !tbl.plugin('blockUi').blockUi">Toggle Block UI (plugin interface)</button>
  <button mat-button (click)="blockUi.blockUi = !blockUi.blockUi">Toggle Block UI (plugin instance)</button>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>
