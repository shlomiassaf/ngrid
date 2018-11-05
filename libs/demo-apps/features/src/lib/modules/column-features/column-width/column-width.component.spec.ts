import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnWidthTableExampleComponent } from './cell-width.component';

describe('ColumnWidthTableExampleComponent', () => {
  let component: ColumnWidthTableExampleComponent;
  let fixture: ComponentFixture<ColumnWidthTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnWidthTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnWidthTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
