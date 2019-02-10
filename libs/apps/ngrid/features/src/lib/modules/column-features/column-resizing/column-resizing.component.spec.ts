import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnResizingGridExampleComponent } from './column-resizing.component';

describe('ColumnResizingGridExampleComponent', () => {
  let component: ColumnResizingGridExampleComponent;
  let fixture: ComponentFixture<ColumnResizingGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnResizingGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnResizingGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
