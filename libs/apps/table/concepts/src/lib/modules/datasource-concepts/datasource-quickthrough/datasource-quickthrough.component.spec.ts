import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceQuickthroughTableExampleComponent } from './datasource-quickthrough.component';

describe('DatasourceQuickthroughTableExampleComponent', () => {
  let component: DatasourceQuickthroughTableExampleComponent;
  let fixture: ComponentFixture<DatasourceQuickthroughTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceQuickthroughTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceQuickthroughTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
