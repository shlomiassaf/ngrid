import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsTableExampleComponent } from './events.component';

describe('EventsTableExampleComponent', () => {
  let component: EventsTableExampleComponent;
  let fixture: ComponentFixture<EventsTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
