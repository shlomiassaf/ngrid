# Empty collection template

When the datasource does not contain items (length is 0) the table will show the empty collection template.

The template can be defined at any location using the structural directive **`*negTableNoDataRef`**

```html
<div *negTableNoDataRef class="neg-table-no-data">
  <span>No Results</span>
</div>
```

I> The Empty Collection Template is part of the registry, i.e. - Registry cascading rules apply.

<docsi-mat-example-with-source title="Synchronous (immediate) empty set" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@neg-example:ex-1-->
  <neg-table blockUi
            [dataSource]="syncDataSource"
            [columns]="columns" style="height: 300px">
  </neg-table>
  <!--@neg-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Asynchronous empty set" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@neg-example:ex-2-->
  <neg-table blockUi
            [dataSource]="aSyncDataSource"
            [columns]="columns" style="height: 300px">
  </neg-table>
  <!--@neg-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Dynamic set" contentClass="mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@neg-example:ex-3-->
  <mat-radio-group class="example-radio-group" (change)="moveToStep($event.value)" [value]="currentDynamicStep">
    <mat-radio-button class="example-radio-button" *ngFor="let step of dynamicSteps; index as index" [value]="index">{{ step }}</mat-radio-button>
  </mat-radio-group>
  <neg-table blockUi
            [dataSource]="dynamicDataSource"
            [columns]="columns" style="height: 300px">
  </neg-table>
  <!--@neg-example:ex-3-->
</docsi-mat-example-with-source>
