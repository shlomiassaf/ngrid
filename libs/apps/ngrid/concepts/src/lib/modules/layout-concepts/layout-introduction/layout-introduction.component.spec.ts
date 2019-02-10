import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutIntroductionGridExampleComponent } from './layout-introduction.component';

describe('LayoutIntroductionGridExampleComponent', () => {
  let component: LayoutIntroductionGridExampleComponent;
  let fixture: ComponentFixture<LayoutIntroductionGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutIntroductionGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutIntroductionGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
