# Column Header Menu

The main column header row can be extended in 2 ways, using a template or using a component.

If you hover over the header row you will see a **resize** handler, this is provided by the `@pebula/drag` plugin and it is using a **template** extension to inject
the resizer internally.

If you click on the **name** column you will see it is sorted now, with a sort indicator presented. This is provided by the `@pebula/ngrid-material/sort` plugin
and it is using a **component** extension to inject the `MatSortHeader` component from `@angular/material/sort`.

I> You can inspect the code in these plugins to get a better idea how it works.

Using a **template** extension is recommended in most cases. If you define it as the content of the grid it will be applied only for that grid
otherwise it will be applied globally (the scope of the registry).

Using a **component** extension is recommended when you have a working component that you want to abstract, e.g. `MatSortHeader` is already built
so it makes sense using it as is.

For the purpose of this demo we will use a **template** extension because it require less boilerplate and less setup.

<docsi-mat-example-with-source title="Column Header Menu" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid class="pbl-ngrid-cell-ellipsis pbl-ngrid-header-cell-ellipsis" blockUi matSort [dataSource]="ds" [columns]="columns">
    <div *pblNgridCellTypeDef="'accountBalance'; let ctx; value as value; col as col; row as row"
         [ngridCellStyle]="{ background: value < 0 ? col.type.data.neg : col.type.data.pos }">{{ value | number:col.type.data.format }}</div>
    <div *pblNgridHeaderExtensionRef="let ctx" style="position: absolute; right: 0; height: 100%; cursor: pointer; margin-right: 12px;"
        [matMenuTriggerFor]="columnMenu" [matMenuTriggerData]="ctx" fxLayoutAlign="center center">
      <mat-icon style="height: 16px; width: 16px; font-size: 16px; line-height: 16px;">more_vert</mat-icon>
    </div>
    <mat-menu #columnMenu="matMenu">
      <ng-template matMenuContent let-ctx>
        <button mat-menu-item (click)="ctx.table.columnApi.autoSizeColumn(ctx.col)">Auto Fit</button>
        <button mat-menu-item [matMenuTriggerFor]="columnSortMenu" [matMenuTriggerData]="ctx" [disabled]="!ctx.col.sort">Sort</button>
        <button mat-menu-item [matMenuTriggerFor]="columnPinMenu" [matMenuTriggerData]="ctx">Pin</button>
      </ng-template>
    </mat-menu>
    <mat-menu #columnSortMenu="matMenu">
      <ng-template matMenuContent let-ctx>
        <button mat-menu-item (click)="ctx.table.ds.setSort()">None</button>
        <button mat-menu-item (click)="ctx.table.ds.setSort(ctx.col, { order: 'asc' })">Asc</button>
        <button mat-menu-item (click)="ctx.table.ds.setSort(ctx.col, { order: 'desc' })">Desc</button>
      </ng-template>
    </mat-menu>
    <mat-menu #columnPinMenu="matMenu">
      <ng-template matMenuContent let-ctx>
        <button mat-menu-item (click)="ctx.col.columnDef.updatePin()">Unpin</button>
        <button mat-menu-item (click)="ctx.col.columnDef.updatePin('start')">Pin Start</button>
        <button mat-menu-item (click)="ctx.col.columnDef.updatePin('end')">Pin End</button>
      </ng-template>
    </mat-menu>

  </pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

Most of the code lives in the template (html) and there no use of the component for the menu itself or how it functions.

For a more complete solution it will probably be best to wrap the template inside a component and use that component inside grid's we want to have the menu in.
This way we can also pass parameters to the component before it generate and register the template.

The menu is pure UI, so it doesn't make sense to include a built in menu with the core package. A menu is planed in `@pebula/ngrid-material` that uses
material components.
