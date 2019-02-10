
    import { async, TestBed } from '@angular/core/testing';
    import { PblNgridTargetEventsModule } from './target-events.module';

    describe('PblNgridTargetEventsModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ PblNgridTargetEventsModule ]
        })
        .compileComponents();
      }));

      it('should create', () => {
        expect(PblNgridTargetEventsModule).toBeDefined();
      });
    });
