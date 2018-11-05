import { async, TestBed } from '@angular/core/testing';
import { FeaturesModule } from './features.module';

describe('FeaturesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FeaturesModule ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    expect(FeaturesModule).toBeDefined();
  });
});
