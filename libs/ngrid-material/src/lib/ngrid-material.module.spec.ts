
    import { async, TestBed } from '@angular/core/testing';
    import { PblNgridMaterialModule } from './ngrid-material.module';
    
    describe('PblNgridMaterialModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ PblNgridMaterialModule ]
        })
        .compileComponents();
      }));
    
      it('should create', () => {
        expect(PblNgridMaterialModule).toBeDefined();
      });
    });
          