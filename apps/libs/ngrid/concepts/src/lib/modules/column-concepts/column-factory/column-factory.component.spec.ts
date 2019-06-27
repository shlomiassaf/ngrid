import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnFactoryGridExampleComponent } from './column-factory.component';

describe('ColumnFactoryGridExampleComponent', () => {
  let component: ColumnFactoryGridExampleComponent;
  let fixture: ComponentFixture<ColumnFactoryGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnFactoryGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnFactoryGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
