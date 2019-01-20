import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HideColumnsTableExampleComponent } from './hide-columns.component';

describe('HideColumnsTableExampleComponent', () => {
  let component: HideColumnsTableExampleComponent;
  let fixture: ComponentFixture<HideColumnsTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HideColumnsTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HideColumnsTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
