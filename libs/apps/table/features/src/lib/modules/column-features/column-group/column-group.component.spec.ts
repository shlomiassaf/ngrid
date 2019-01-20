import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnGroupTableExampleComponent } from './column-group.component';

describe('ColumnGroupTableExampleComponent', () => {
  let component: ColumnGroupTableExampleComponent;
  let fixture: ComponentFixture<ColumnGroupTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnGroupTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnGroupTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
