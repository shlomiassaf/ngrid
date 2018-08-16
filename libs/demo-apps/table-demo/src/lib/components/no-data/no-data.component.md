# No Data

<docsi-mat-example-with-source title="Sync no data" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@sac-example:ex-1-->
  <sg-table blockUi
            [dataSource]="syncDataSource"
            [columns]="columns"
            style="height: 250px"
            class="sg-boxed-table">
  </sg-table>
  <!--@sac-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Async no data" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@sac-example:ex-2-->
  <sg-table blockUi
            [dataSource]="aSyncDataSource"
            [columns]="columns"
            style="height: 250px"
            class="sg-boxed-table">
  </sg-table>
  <!--@sac-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Dynamic sync/async data/no data" contentClass="mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@sac-example:ex-3-->
  <mat-radio-group class="example-radio-group" (change)="moveToStep($event.value)" [value]="currentDynamicStep">
    <mat-radio-button class="example-radio-button" *ngFor="let step of dynamicSteps; index as index" [value]="index">{{ step }}</mat-radio-button>
  </mat-radio-group>
  <sg-table blockUi
            [dataSource]="dynamicDataSource"
            [columns]="columns"
            style="height: 250px"
            class="sg-boxed-table">
  </sg-table>
  <!--@sac-example:ex-3-->
</docsi-mat-example-with-source>
