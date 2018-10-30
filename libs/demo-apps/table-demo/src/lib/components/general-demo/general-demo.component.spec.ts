import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDemoComponent } from './general-demo.component';

describe('GeneralDemoComponent', () => {
  let component: GeneralDemoComponent;
  let fixture: ComponentFixture<GeneralDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
