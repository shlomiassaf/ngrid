# Switching Column Definitions

<docsi-mat-example-with-source title="Switching Column Definitions" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid #grid1 [dataSource]="ds1" [columns]="columns1">
   <div *pblNgridCellDef="'birthdate'; row as row">
      <div>{{ row.birthdate | date }}</div>
   </div>  
    <div *pblNgridCellDef="'__list_item_view__'; row as row">
      <div fxLayout="row">
        <h3>{{ row.id }}</h3>
        <div fxFlex="*"></div>
        <h3>{{ row.name }}</h3>
      </div>
      <p>{{ row.birthdate  | date }}</p>
    </div>
  </pbl-ngrid>
  <button mat-flat-button (click)="toggleView()">Toggle Columns View</button>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>
