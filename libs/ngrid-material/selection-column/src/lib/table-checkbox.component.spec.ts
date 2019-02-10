import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PblNgridCheckboxComponent } from './table-checkbox.component';

describe('PblNgridCheckboxComponent', () => {
  let component: PblNgridCheckboxComponent;
  let fixture: ComponentFixture<PblNgridCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PblNgridCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PblNgridCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
