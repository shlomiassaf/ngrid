import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { createDS, columnFactory, PblNgridComponent } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-action-row-example',
  templateUrl: './action-row.component.html',
  styleUrls: ['./action-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-action-row-example', { title: 'Action Row' })
export class ActionRowExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();
  ds = createDS<Person>()
    .onTrigger( () => this.datasource.getPeople(500, 500) )
    .create();

  constructor(private datasource: DynamicClientApi) { }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'my-grid-action-row',
  templateUrl: './my-grid-action-row.component.html',
  styleUrls: [ './my-grid-action-row.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class MyGridActionRowComponent implements AfterViewInit {

  @Input() get filter(): boolean { return this._filter; }
  set filter(value: boolean) { this._filter = coerceBooleanProperty(value); }

  @Input() label: string;

  @ViewChild('actionRow', { read: TemplateRef, static: true }) actionRow: TemplateRef<any>;

  private _filter = false;

  constructor(public grid: PblNgridComponent<any>) { }

  refresh(): void {
    this.grid.ds.refresh();
  }

  ngAfterViewInit(): void {
    this.grid.createView('beforeTable', this.actionRow);
  }

  actionRowFilter(filterValue: string) {
    this.grid.ds.setFilter(filterValue.trim(), this.grid.columnApi.visibleColumns);
  }
}
