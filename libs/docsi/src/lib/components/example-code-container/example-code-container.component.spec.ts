import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleCodeContainerComponent } from './example-code-container.component';

describe('ExampleCodeContainerComponent', () => {
  let component: ExampleCodeContainerComponent;
  let fixture: ComponentFixture<ExampleCodeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleCodeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleCodeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
