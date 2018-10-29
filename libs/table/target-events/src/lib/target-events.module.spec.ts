
    import { async, TestBed } from '@angular/core/testing';
    import { NegTableTargetEventsModule } from './target-events.module';

    describe('NegTableTargetEventsModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ NegTableTargetEventsModule ]
        })
        .compileComponents();
      }));

      it('should create', () => {
        expect(NegTableTargetEventsModule).toBeDefined();
      });
    });
