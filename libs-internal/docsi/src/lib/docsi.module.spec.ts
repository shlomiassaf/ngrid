
import { async, TestBed } from '@angular/core/testing';
import { DocsiModule } from './docsi.module';

describe('DocsiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DocsiModule ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    expect(DocsiModule).toBeDefined();
  });
});
      