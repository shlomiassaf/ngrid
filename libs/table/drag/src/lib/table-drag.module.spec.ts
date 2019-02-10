
    import { async, TestBed } from '@angular/core/testing';
    import { PblTableDragModule } from './table-drag.module';

    describe('PblTableDragModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ PblTableDragModule ]
        })
        .compileComponents();
      }));

      it('should create', () => {
        expect(PblTableDragModule).toBeDefined();
      });
    });
