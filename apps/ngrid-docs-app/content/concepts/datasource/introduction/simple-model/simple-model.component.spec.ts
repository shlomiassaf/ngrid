
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
    const columnIds = await (await loader.getHarness(PblNgridHarness)).getColumnIds();
    expect(columnIds).toEqual(['id', 'name', 'email']);
  });

  it('should show the data provided', async () => {
    const data = await (await loader.getHarness(PblNgridHarness)).getViewPortData();

    expect(data).toEqual([
      ['10', 'John Doe', 'john.doe@anonymous.com']
    ]);
  });
});

