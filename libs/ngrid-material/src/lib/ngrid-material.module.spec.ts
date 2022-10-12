
import { TestBed } from '@angular/core/testing';
import { PblNgridMaterialModule } from './ngrid-material.module';
    
    describe('PblNgridMaterialModule', () => {

      beforeEach(async () => {
        await TestBed.configureTestingModule({
        }).compileComponents();
      });
    
      it('should create', () => {
        expect(PblNgridMaterialModule).toBeDefined();
      });
    });
          