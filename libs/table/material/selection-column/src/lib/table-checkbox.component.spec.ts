import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegTableCheckboxComponent } from './table-checkbox.component';

describe('NegTableCheckboxComponent', () => {
  let component: NegTableCheckboxComponent;
  let fixture: ComponentFixture<NegTableCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegTableCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegTableCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
