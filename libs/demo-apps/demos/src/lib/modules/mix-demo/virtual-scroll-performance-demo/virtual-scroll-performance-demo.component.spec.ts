import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScrollPerformanceDemoTableExampleComponent } from './virtual-scroll-performance-demo.component';

describe('VirtualScrollPerformanceDemoTableExampleComponent', () => {
  let component: VirtualScrollPerformanceDemoTableExampleComponent;
  let fixture: ComponentFixture<VirtualScrollPerformanceDemoTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualScrollPerformanceDemoTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualScrollPerformanceDemoTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
