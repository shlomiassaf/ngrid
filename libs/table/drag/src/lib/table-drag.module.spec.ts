
    import { async, TestBed } from '@angular/core/testing';
    import { NegTableDragModule } from './table-drag.module';

    describe('NegTableDragModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ NegTableDragModule ]
        })
        .compileComponents();
      }));

      it('should create', () => {
        expect(NegTableDragModule).toBeDefined();
      });
    });
