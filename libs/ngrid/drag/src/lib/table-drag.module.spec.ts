
    import { async, TestBed } from '@angular/core/testing';
    import { PblNgridDragModule } from './table-drag.module';

    describe('PblNgridDragModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ PblNgridDragModule ]
        })
        .compileComponents();
      }));

      it('should create', () => {
        expect(PblNgridDragModule).toBeDefined();
      });
    });
