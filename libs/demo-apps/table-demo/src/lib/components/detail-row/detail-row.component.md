# Detail Row

<docsi-mat-example-with-source title="Detail Row" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@sac-example:ex-1-->
  <sg-table blockUi [dataSource]="ds1" [columns]="columns" detailRow>
    <div *sgTableDetailRowDef="let row" class="sg-detail-row">
      <div>
        <h1>Detail Row</h1>
        <pre>{{row | json}}</pre>
      </div>
    </div>
  </sg-table>
  <!--@sac-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Detail Row custom parent" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@sac-example:ex-2-->
  <sg-table blockUi [dataSource]="ds1" [columns]="columns" detailRow>
    <div *sgTableDetailRowDef="let row" class="sg-detail-row">
      <div>
        <h1>Detail Row</h1>
        <pre>{{row | json}}</pre>
      </div>
    </div>
    <sg-table-row *sgTableDetailRowParentRef="let row; table as table"
              [detailRow]="row" [table]="table"
              matRipple>
    </sg-table-row>
  </sg-table>
  <!--@sac-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Detail Row Single mode & exclude toggle mode" contentClass="mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@sac-example:ex-3-->
  <sg-table blockUi [dataSource]="ds1" [columns]="columns"
            detailRow [singleDetailRow]="forceSingle" [excludeToggleFrom]="disableName">
    <div *sgTableDetailRowDef="let row" class="sg-detail-row">
      <div>
        <h1>Detail Row</h1>
        <pre>{{row | json}}</pre>
      </div>
    </div>
  </sg-table>
  <mat-checkbox [checked]="forceSingle" (change)="forceSingle = $event.checked">Force single row</mat-checkbox>
  <mat-checkbox [checked]="disableName.length > 0" (change)="disableName = disableName.length === 0 ? ['name'] : []">Disable toggle from 'Name'</mat-checkbox>
  <!--@sac-example:ex-3-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Detail Row predicate" contentClass="mat-elevation-z7" [query]="[{section: 'ex-4'}]">
  <!--@sac-example:ex-4-->
  <sg-table blockUi [dataSource]="ds1" [columns]="columns"
            [detailRow]="detailRowPredicate">
    <div *sgTableDetailRowDef="let row" class="sg-detail-row">
      <div>
        <h1>Detail Row</h1>
        <pre>{{row | json}}</pre>
      </div>
    </div>
  </sg-table>
  <mat-radio-group (change)="onDetailRowChange($event.value)" [value]="detailRow">
    <mat-radio-button value="off">Off</mat-radio-button>
    <mat-radio-button value="on">On</mat-radio-button>
    <mat-radio-button value="predicate">Predicate (Even rows only)</mat-radio-button>
  </mat-radio-group>
  <!--@sac-example:ex-4-->
</docsi-mat-example-with-source>
