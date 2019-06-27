# Hide Columns

<docsi-mat-example-with-source title="Hide Columns" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid #pblTbl1 [hideColumns]="hideColumns1" [dataSource]="ds1" [columns]="columns1">
    <div *pblNgridOuterSection="'top'" class="pbl-ngrid-row">
     <div class="pbl-ngrid-header-cell"></div>
      <div class="pbl-ngrid-header-cell" style="flex: 0 0 70px">
        <mat-select multiple [value]="hideColumns1">
          <mat-select-trigger>
            <mat-icon>remove_red_eye</mat-icon>{{ hideColumns1.length }}
          </mat-select-trigger>
          <mat-option *ngFor="let c of pblTbl1.columnApi.columns" [value]="c.id"
                      (onSelectionChange)="$event.isUserInput && toggleColumn(hideColumns1, $event.source.value)">{{c.label}}</mat-option>
        </mat-select>
      </div>
    </div>
  </pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Hide Columns with Group Headers" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-ngrid #pblTbl2 [hideColumns]="hideColumns2" [dataSource]="ds2" [columns]="columns2">
    <div *pblNgridOuterSection="'top'" class="pbl-ngrid-row">
     <div class="pbl-ngrid-header-cell"></div>
      <div class="pbl-ngrid-header-cell" style="flex: 0 0 70px">
        <mat-select multiple [value]="hideColumns2">
          <mat-select-trigger>
            <mat-icon>remove_red_eye</mat-icon>{{ hideColumns2.length }}
          </mat-select-trigger>
          <mat-option *ngFor="let c of pblTbl2.columnApi.columns" [value]="c.id"
                      (onSelectionChange)="$event.isUserInput && toggleColumn(hideColumns2, $event.source.value)">{{c.label}}</mat-option>
        </mat-select>
      </div>
    </div>
  </pbl-ngrid>

  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

