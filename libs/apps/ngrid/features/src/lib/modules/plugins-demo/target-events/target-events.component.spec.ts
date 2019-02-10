import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetEventsGridExampleComponent } from './target-events.component';

describe('TargetEventsGridExampleComponent', () => {
  let component: TargetEventsGridExampleComponent;
  let fixture: ComponentFixture<TargetEventsGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetEventsGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetEventsGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
