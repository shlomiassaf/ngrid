
    import { async, TestBed } from '@angular/core/testing';
    import { SgMaterialModule } from './material.module';
    
    describe('SgMaterialModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ SgMaterialModule ]
        })
        .compileComponents();
      }));
    
      it('should create', () => {
        expect(SgMaterialModule).toBeDefined();
      });
    });
          