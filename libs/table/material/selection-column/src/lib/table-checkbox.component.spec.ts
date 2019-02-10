import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PblTableCheckboxComponent } from './table-checkbox.component';

describe('PblTableCheckboxComponent', () => {
  let component: PblTableCheckboxComponent;
  let fixture: ComponentFixture<PblTableCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PblTableCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PblTableCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
