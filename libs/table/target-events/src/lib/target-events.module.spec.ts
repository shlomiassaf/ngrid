
    import { async, TestBed } from '@angular/core/testing';
    import { SgTableTargetEventsModule } from './target-events.module';

    describe('SgTableTargetEventsModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ SgTableTargetEventsModule ]
        })
        .compileComponents();
      }));

      it('should create', () => {
        expect(SgTableTargetEventsModule).toBeDefined();
      });
    });
