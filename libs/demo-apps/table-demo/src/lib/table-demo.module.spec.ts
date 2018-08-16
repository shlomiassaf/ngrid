
import { async, TestBed } from '@angular/core/testing';
import { TableDemoModule } from './table-demo.module';

describe('TableDemoModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TableDemoModule ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    expect(TableDemoModule).toBeDefined();
  });
});
