import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScrollTableExampleComponent } from './virtual-scroll.component';

describe('VirtualScrollTableExampleComponent', () => {
  let component: VirtualScrollTableExampleComponent;
  let fixture: ComponentFixture<VirtualScrollTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualScrollTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualScrollTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
