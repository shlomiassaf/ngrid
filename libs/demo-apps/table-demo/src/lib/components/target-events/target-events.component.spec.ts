import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetEventsTableExampleComponent } from './target-events.component';

describe('TargetEventsTableExampleComponent', () => {
  let component: TargetEventsTableExampleComponent;
  let fixture: ComponentFixture<TargetEventsTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetEventsTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetEventsTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
