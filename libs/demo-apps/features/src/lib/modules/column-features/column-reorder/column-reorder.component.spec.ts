import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnReorderTableExampleComponent } from './column-reorder.component';

describe('ColumnReorderTableExampleComponent', () => {
  let component: ColumnReorderTableExampleComponent;
  let fixture: ComponentFixture<ColumnReorderTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnReorderTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnReorderTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
