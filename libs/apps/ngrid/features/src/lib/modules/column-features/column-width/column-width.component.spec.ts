import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnWidthGridExampleComponent } from './cell-width.component';

describe('ColumnWidthGridExampleComponent', () => {
  let component: ColumnWidthGridExampleComponent;
  let fixture: ComponentFixture<ColumnWidthGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnWidthGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnWidthGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
