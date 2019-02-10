import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceQuickthroughGridExampleComponent } from './datasource-quickthrough.component';

describe('DatasourceQuickthroughGridExampleComponent', () => {
  let component: DatasourceQuickthroughGridExampleComponent;
  let fixture: ComponentFixture<DatasourceQuickthroughGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceQuickthroughGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceQuickthroughGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
