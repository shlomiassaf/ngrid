import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRowStoryGridExampleComponent } from './action-row.component';

describe('ActionRowStoryGridExampleComponent', () => {
  let component: ActionRowStoryGridExampleComponent;
  let fixture: ComponentFixture<ActionRowStoryGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionRowStoryGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRowStoryGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
