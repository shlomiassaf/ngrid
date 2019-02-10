import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScrollPerformanceDemoGridExampleComponent } from './virtual-scroll-performance-demo.component';

describe('VirtualScrollPerformanceDemoGridExampleComponent', () => {
  let component: VirtualScrollPerformanceDemoGridExampleComponent;
  let fixture: ComponentFixture<VirtualScrollPerformanceDemoGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualScrollPerformanceDemoGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualScrollPerformanceDemoGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
