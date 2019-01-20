import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoContainerPageComponent } from './demo-container-page.component';

describe('DemoContainerPageComponent', () => {
  let component: DemoContainerPageComponent;
  let fixture: ComponentFixture<DemoContainerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoContainerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoContainerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
