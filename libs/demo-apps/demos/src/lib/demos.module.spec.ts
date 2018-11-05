
import { async, TestBed } from '@angular/core/testing';
import { DemosModule } from './demos.module';

describe('DemosModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DemosModule ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    expect(DemosModule).toBeDefined();
  });
});
