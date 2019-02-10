import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScrollGridExampleComponent } from './virtual-scroll.component';

describe('VirtualScrollGridExampleComponent', () => {
  let component: VirtualScrollGridExampleComponent;
  let fixture: ComponentFixture<VirtualScrollGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualScrollGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualScrollGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
