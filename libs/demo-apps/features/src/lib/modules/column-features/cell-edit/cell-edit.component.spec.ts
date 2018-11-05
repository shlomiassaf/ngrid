import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRowStoryTableExampleComponent } from './action-row.component';

describe('ActionRowStoryTableExampleComponent', () => {
  let component: ActionRowStoryTableExampleComponent;
  let fixture: ComponentFixture<ActionRowStoryTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionRowStoryTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRowStoryTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
