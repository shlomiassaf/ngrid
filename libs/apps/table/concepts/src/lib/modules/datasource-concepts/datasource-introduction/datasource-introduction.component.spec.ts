import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceIntroductionlTableExampleComponent } from './datasource-introduction.component';

describe('DatasourceIntroductionlTableExampleComponent', () => {
  let component: DatasourceIntroductionlTableExampleComponent;
  let fixture: ComponentFixture<DatasourceIntroductionlTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceIntroductionlTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceIntroductionlTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
