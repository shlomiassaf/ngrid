
import { async, TestBed } from '@angular/core/testing';
import { DocsiMaterialSuiteModule } from './docsi-material-suite.module';

describe('DocsiMaterialSuiteModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DocsiMaterialSuiteModule ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    expect(DocsiMaterialSuiteModule).toBeDefined();
  });
});
      