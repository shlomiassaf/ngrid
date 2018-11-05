import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionColumnTableExampleComponent } from './selection-column.component';

describe('SelectionColumnTableExampleComponent', () => {
  let component: SelectionColumnTableExampleComponent;
  let fixture: ComponentFixture<SelectionColumnTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionColumnTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionColumnTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
