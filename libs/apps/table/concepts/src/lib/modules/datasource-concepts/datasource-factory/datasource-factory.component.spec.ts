import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceFactoryTableExampleComponent } from './datasource-factory.component';

describe('DatasourceFactoryTableExampleComponent', () => {
  let component: DatasourceFactoryTableExampleComponent;
  let fixture: ComponentFixture<DatasourceFactoryTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceFactoryTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceFactoryTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
