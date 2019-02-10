
    import { async, TestBed } from '@angular/core/testing';
    import { PblTableTargetEventsModule } from './target-events.module';

    describe('PblTableTargetEventsModule', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ PblTableTargetEventsModule ]
        })
        .compileComponents();
      }));

      it('should create', () => {
        expect(PblTableTargetEventsModule).toBeDefined();
      });
    });
