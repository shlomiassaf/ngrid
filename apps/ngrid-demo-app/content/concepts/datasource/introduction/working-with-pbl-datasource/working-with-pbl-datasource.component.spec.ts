
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoDataSource } from '@pebula/apps/shared-data';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridHarness } from '@pebula/ngrid/testing';
import { WorkingWithPblDataSourceExample } from './working-with-pbl-datasource.component';

const demoDataSource = new DemoDataSource();

describe('demo-app/datasource/working-with-pbl-datasource', () => {
  let fixture: ComponentFixture<WorkingWithPblDataSourceExample>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PblNgridModule.forRoot({}, [])],
      declarations: [WorkingWithPblDataSourceExample],
      providers: [
        { provide: DemoDataSource, useValue: demoDataSource },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkingWithPblDataSourceExample);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should show the data provided', async () => {
    (await loader.getHarness(PblNgridHarness)).scrollToEnd();
    const data = await (await loader.getHarness(PblNgridHarness)).getViewPortData();
    const dsData = await demoDataSource.getPeople(0, 4);
    expect(data).toEqual(dsData.map( d => [d.id.toString(), d.name, d.email]));
  });
});

