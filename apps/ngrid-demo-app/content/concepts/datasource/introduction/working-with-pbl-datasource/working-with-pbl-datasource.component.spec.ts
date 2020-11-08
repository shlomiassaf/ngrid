import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridHarness, ScrollToLocation } from '@pebula/ngrid/testing';
import { WorkingWithPblDataSourceExample } from './working-with-pbl-datasource.component';
import { getDataSourceProvider, getDataSource } from '../../../../../src/__test-runners/test-datasource';

describe('demo-app/datasource/working-with-pbl-datasource', () => {
  let fixture: ComponentFixture<WorkingWithPblDataSourceExample>;
  let loader: HarnessLoader;
  let nGridHarness: PblNgridHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PblNgridModule.forRoot({}, [])],
      declarations: [WorkingWithPblDataSourceExample],
      providers: [
        await getDataSourceProvider(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkingWithPblDataSourceExample);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    nGridHarness = await loader.getHarness(PblNgridHarness);
  });

  it('should show the data provided', async () => {
    const data = await nGridHarness.getViewPortData();
    expect(data.length).toBeGreaterThanOrEqual(1);
    const dsData = await getDataSource().getPeople(0, data.length);
    expect(data).toEqual(dsData.map( d => [d.id.toString(), d.name, d.email]));
  });

  it('should show the data provided scrolling to the end (vScroll)', async () => {
    await nGridHarness.waitForRenderChanged(() => nGridHarness.scrollToLocation(ScrollToLocation.VerticalEnd))
    const data = await nGridHarness.getViewPortData();
    expect(data.length).toBeGreaterThanOrEqual(1);
    const dsData = await getDataSource().getPeople(0, 500);
    dsData.splice(0, dsData.length - data.length);
    expect(data).toEqual(dsData.map( d => [d.id.toString(), d.name, d.email]));
  });
});

