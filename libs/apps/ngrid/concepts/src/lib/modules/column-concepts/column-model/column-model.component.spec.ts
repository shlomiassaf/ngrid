import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnModelGridExampleComponent } from './column-model.component';

describe('ColumnModelGridExampleComponent', () => {
  let component: ColumnModelGridExampleComponent;
  let fixture: ComponentFixture<ColumnModelGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnModelGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnModelGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
