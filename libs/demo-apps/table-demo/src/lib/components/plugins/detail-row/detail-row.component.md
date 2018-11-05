# Detail Row

I> Requires `@neg/table/target-event` plugin

<docsi-mat-example-with-source title="Detail Row" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@neg-example:ex-1-->
  <neg-table blockUi [dataSource]="ds1" [columns]="columns" detailRow style="height: 300px">
    <div *negTableDetailRowDef="let row" class="neg-detail-row">
      <div>
        <h1>Detail Row</h1>
        <pre>{{row | json}}</pre>
      </div>
    </div>
  </neg-table>
  <!--@neg-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Detail Row custom parent" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@neg-example:ex-2-->
  <neg-table blockUi [dataSource]="ds1" [columns]="columns" detailRow style="height: 300px">
    <div *negTableDetailRowDef="let row" class="neg-detail-row">
      <div>
        <h1>Detail Row</h1>
        <pre>{{row | json}}</pre>
      </div>
    </div>
    <neg-table-row *negTableDetailRowParentRef="let row; table as table"
              [detailRow]="row" [table]="table"
              matRipple>
    </neg-table-row>
  </neg-table>
  <!--@neg-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Detail Row Single mode & exclude toggle mode" contentClass="mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@neg-example:ex-3-->
  <neg-table blockUi [dataSource]="ds1" [columns]="columns"
            detailRow [singleDetailRow]="forceSingle" [excludeToggleFrom]="disableName" style="height: 300px">
    <div *negTableDetailRowDef="let row" class="neg-detail-row">
      <div>
        <h1>Detail Row</h1>
        <pre>{{row | json}}</pre>
      </div>
    </div>
  </neg-table>
  <mat-checkbox [checked]="forceSingle" (change)="forceSingle = $event.checked">Force single row</mat-checkbox>
  <mat-checkbox [checked]="disableName.length > 0" (change)="disableName = disableName.length === 0 ? ['name'] : []">Disable toggle from 'Name'</mat-checkbox>
  <!--@neg-example:ex-3-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Detail Row predicate" contentClass="mat-elevation-z7" [query]="[{section: 'ex-4'}]">
  <!--@neg-example:ex-4-->
  <neg-table blockUi [dataSource]="ds1" [columns]="columns"
            [detailRow]="detailRowPredicate" style="height: 300px">
    <div *negTableDetailRowDef="let row" class="neg-detail-row">
      <div>
        <h1>Detail Row</h1>
        <pre>{{row | json}}</pre>
      </div>
    </div>
  </neg-table>
  <mat-radio-group (change)="onDetailRowChange($event.value)" [value]="detailRow">
    <mat-radio-button value="off">Off</mat-radio-button>
    <mat-radio-button value="on">On</mat-radio-button>
    <mat-radio-button value="predicate">Predicate (Even rows only)</mat-radio-button>
  </mat-radio-group>
  <!--@neg-example:ex-4-->
</docsi-mat-example-with-source>
