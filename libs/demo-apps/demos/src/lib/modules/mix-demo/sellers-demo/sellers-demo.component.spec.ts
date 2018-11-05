import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHomePageComponent } from './app-home-page.component';

describe('AppHomePageComponent', () => {
  let component: AppHomePageComponent;
  let fixture: ComponentFixture<AppHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
