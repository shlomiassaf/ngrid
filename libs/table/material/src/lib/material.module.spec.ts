
    import { async, TestBed } from '@angular/core/testing';
    import { NegMaterialModule } from './material.module';
    
    describe('NegMaterialModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ NegMaterialModule ]
        })
        .compileComponents();
      }));
    
      it('should create', () => {
        expect(NegMaterialModule).toBeDefined();
      });
    });
          