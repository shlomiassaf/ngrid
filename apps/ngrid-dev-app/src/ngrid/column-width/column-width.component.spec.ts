import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridHarness, ScrollToLocation } from '@pebula/ngrid/testing';

import { StaticRestClientApi } from '@pebula/apps/dev-app-lib/client-api';
import { ColumnWidthExample } from './column-width.component';

describe('demo-app/datasource/working-with-pbl-datasource', () => {
  let fixture: ComponentFixture<ColumnWidthExample>;
  let loader: HarnessLoader;
  let nGridHarness: PblNgridHarness;
  let ds: StaticRestClientApi;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PblNgridModule.forRoot({}, [])],
      declarations: [ColumnWidthExample],
    }).compileComponents()

    fixture = TestBed.createComponent(ColumnWidthExample);
    ds = fixture.debugElement.injector.get(StaticRestClientApi);

    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    nGridHarness = await loader.getHarness(PblNgridHarness);
  });

  it('should show the data provided', async () => {
    const data = await nGridHarness.getViewPortData();
    expect(data.length).toBeGreaterThanOrEqual(1);
    const dsData = (await ds.getSellersAll()).slice(0, data.length);
    expect(data).toEqual(dsData.map( d => [d.id.toString(), d.name, d.email, d.address]));
  });

});

