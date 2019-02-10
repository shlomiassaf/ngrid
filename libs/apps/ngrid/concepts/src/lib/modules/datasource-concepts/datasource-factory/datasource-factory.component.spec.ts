import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceFactoryGridExampleComponent } from './datasource-factory.component';

describe('DatasourceFactoryGridExampleComponent', () => {
  let component: DatasourceFactoryGridExampleComponent;
  let fixture: ComponentFixture<DatasourceFactoryGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceFactoryGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceFactoryGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
