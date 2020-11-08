
import { Component } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { createDS, columnFactory } from '@pebula/ngrid';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridHarness } from './grid';

describe('test', () => {
  let fixture: ComponentFixture<PblNgridComponentTest>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PblNgridModule.forRoot({}, [])],
      declarations: [PblNgridComponentTest],
    }).compileComponents();

    fixture = TestBed.createComponent(PblNgridComponentTest);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should load harness for a grid', async () => {
    const grids = await loader.getAllHarnesses(PblNgridHarness);
    expect(grids.length).toBe(1);
  });

  it('should have the columns provided', async () => {
    const columnIds = await loader.getHarness(PblNgridHarness)
      .then( grid => grid.getColumnHeaderRow() )
      .then( header => header.getCells() )
      .then( columns => Promise.all(columns.map( c => c.getColumnId() )) );

    expect(columnIds).toEqual(['position', 'name', 'weight', 'symbol']);
  });
});

@Component({
  template: `<pbl-ngrid [dataSource]="ds" [columns]="columns"></pbl-ngrid>`,
})
export class PblNgridComponentTest {
  columns = columnFactory()
    .default({ minWidth: 40 })
    .table(
      { prop: 'position', width: '40px' },
      { prop: 'name' },
      { prop: 'weight', width: '50px' },
      { prop: 'symbol', width: '150px' },
    )
    .build();
  ds = createDS<any>().onTrigger( () => Promise.resolve().then(() => {
    return [
      {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
      {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
      {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
      {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
      {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
      {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
      {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
      {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
      {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
      {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
    ];
  })).create();
}
