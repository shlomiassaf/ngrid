
    import { async, TestBed } from '@angular/core/testing';
    import { PblMaterialModule } from './material.module';

    describe('PblMaterialModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ PblMaterialModule ]
        })
        .compileComponents();
      }));

      it('should create', () => {
        expect(PblMaterialModule).toBeDefined();
      });
    });
