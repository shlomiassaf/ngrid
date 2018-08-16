import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SgTableCheckboxComponent } from './table-checkbox.component';

describe('SgTableCheckboxComponent', () => {
  let component: SgTableCheckboxComponent;
  let fixture: ComponentFixture<SgTableCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SgTableCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgTableCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
