import { async, TestBed } from '@angular/core/testing';
import { FeaturesDemoModule } from './features-demo.module';

describe('FeaturesDemoModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FeaturesDemoModule ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    expect(FeaturesDemoModule).toBeDefined();
  });
});
