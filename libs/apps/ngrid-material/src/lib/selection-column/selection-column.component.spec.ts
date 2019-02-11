import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionColumnGridExampleComponent } from './selection-column.component';

describe('SelectionColumnGridExampleComponent', () => {
  let component: SelectionColumnGridExampleComponent;
  let fixture: ComponentFixture<SelectionColumnGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionColumnGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionColumnGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
