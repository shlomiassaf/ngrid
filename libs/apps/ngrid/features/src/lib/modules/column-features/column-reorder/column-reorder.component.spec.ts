import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnReorderGridExampleComponent } from './column-reorder.component';

describe('ColumnReorderGridExampleComponent', () => {
  let component: ColumnReorderGridExampleComponent;
  let fixture: ComponentFixture<ColumnReorderGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnReorderGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnReorderGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
