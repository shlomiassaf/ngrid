# Target Events

The `target-events` plugin add support for mouse / keyboard event.

By default all grid have no support for such events and we can add them in several ways:

- By adding `target-events` directive to `pbl-ngrid` hosts
- By applying the plugin programmatically to a specific grid or to **ALL** grids automatically

In addition to mouse / keyboard support, `target-events` also add **focus** and **range selection** integration
using the mouse and keyboard. Focus and range selection support already exists in grid but `target-events` exposes them to the user.

## Auto Enable

To automatically enable `target-events` for all grids we use the configuration service:

```typescript

@NgModule({
  declarations: [ ],
  imports: [
    PblNgridModule,
    PblNgridTargetEventsModule, // Make sure to add the `target-events` module
  ]
})
export class MyAppRootModule {
  constructor(config: PblNgridConfigService) {
    config.set('targetEvents', { autoEnable: true });
  }
}
```

## Focus & Range Selection

Once `target-events` is bound to a grid, focus and selection support are enable by default.

However, they will not work unless the `focusMode` of the grid is set to `cell`:

```html
<pbl-ngrid focusMode="cell"></pbl-ngrid>
```

<docsi-mat-example-with-source title="Focus & Range Selection" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid blockUi [dataSource]="ds" [columns]="columns" focusMode="cell"></pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

<p>The plugin is used the ContextApi to support mouse & keyboard behavior, you can read more about the API and working with focus & range selection <a [routerLink]="['../..', 'features', 'focus-and-selection']">here</a></p>

## Events

<docsi-mat-example-with-source title="Cell/Row -> Click Events" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-ngrid blockUi [dataSource]="ds1" [columns]="columns"
            (cellClick)="onClickEvents($event)"
            (rowClick)="onClickEvents($event)"></pbl-ngrid>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Cell/Row -> Enter/Leave Events" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@pebula-example:ex-3-->
  <pbl-ngrid blockUi [dataSource]="ds2" [columns]="columns2" vScrollNone showFooter
            (cellEnter)="onEnterLeaveEvents($event, true)" (cellLeave)="onEnterLeaveEvents($event)"
            (rowEnter)="onEnterLeaveEvents($event, true)" (rowLeave)="onEnterLeaveEvents($event)"></pbl-ngrid>
  <!--@pebula-example:ex-3-->
</docsi-mat-example-with-source>

i> The plugin `@pebula/ngrid/detail-row` requires this plugin
