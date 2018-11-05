import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutIntroductionTableExampleComponent } from './layout-introduction.component';

describe('LayoutIntroductionTableExampleComponent', () => {
  let component: LayoutIntroductionTableExampleComponent;
  let fixture: ComponentFixture<LayoutIntroductionTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutIntroductionTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutIntroductionTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
