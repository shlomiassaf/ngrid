import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnModelTableExampleComponent } from './column-model.component';

describe('ColumnModelTableExampleComponent', () => {
  let component: ColumnModelTableExampleComponent;
  let fixture: ComponentFixture<ColumnModelTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnModelTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnModelTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
