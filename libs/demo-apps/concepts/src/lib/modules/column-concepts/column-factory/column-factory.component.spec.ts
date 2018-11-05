import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnFactoryTableExampleComponent } from './column-factory.component';

describe('ColumnFactoryTableExampleComponent', () => {
  let component: ColumnFactoryTableExampleComponent;
  let fixture: ComponentFixture<ColumnFactoryTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnFactoryTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnFactoryTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
