import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HideColumnsGridExampleComponent } from './hide-columns.component';

describe('HideColumnsGridExampleComponent', () => {
  let component: HideColumnsGridExampleComponent;
  let fixture: ComponentFixture<HideColumnsGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HideColumnsGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HideColumnsGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
