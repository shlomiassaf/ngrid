import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceIntroductionlGridExampleComponent } from './datasource-introduction.component';

describe('DatasourceIntroductionlGridExampleComponent', () => {
  let component: DatasourceIntroductionlGridExampleComponent;
  let fixture: ComponentFixture<DatasourceIntroductionlGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceIntroductionlGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceIntroductionlGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
