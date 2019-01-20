import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnResizingTableExampleComponent } from './column-resizing.component';

describe('ColumnResizingTableExampleComponent', () => {
  let component: ColumnResizingTableExampleComponent;
  let fixture: ComponentFixture<ColumnResizingTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnResizingTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnResizingTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
