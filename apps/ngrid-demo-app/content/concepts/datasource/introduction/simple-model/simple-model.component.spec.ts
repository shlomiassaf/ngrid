
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridHarness } from '@pebula/ngrid/testing';
import { DatasourceIntroductionSimpleModelExample } from './simple-model.component';

describe('demo-app/datasource/simple-model', () => {
  let fixture: ComponentFixture<DatasourceIntroductionSimpleModelExample>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PblNgridModule.forRoot({}, [])],
      declarations: [DatasourceIntroductionSimpleModelExample],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasourceIntroductionSimpleModelExample);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should have the columns provided', async () => {
    const columnIds = await loader.getHarness(PblNgridHarness)
      .then( grid => grid.getColumnHeaderRow() )
      .then( header => header.getCells() )
      .then( columns => Promise.all(columns.map( c => c.getColumnId() )) );

    expect(columnIds).toEqual(['id', 'name', 'email']);
  });

  it('should show the data provided', async () => {
    const data = await loader.getHarness(PblNgridHarness)
      .then( grid => grid.getDataRows() )
      .then( rows => rows.map( r => r.getCells().then( cells => cells.map(c => c.getText() )) ) )
      .then( rows => Promise.all(rows.map( pRow => pRow.then( row => Promise.all(row) ))));

      console.log(fixture.elementRef.nativeElement.getBoundingRect());
      expect(data).toEqual([
      ['10', 'John Doe', 'john.doe@anonymous.com']
    ]);
  });
});

