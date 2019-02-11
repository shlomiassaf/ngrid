import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellTooltipGridExampleComponent } from './cell-tooltip.component';

describe('CellTooltipGridExampleComponent', () => {
  let component: CellTooltipGridExampleComponent;
  let fixture: ComponentFixture<CellTooltipGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellTooltipGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellTooltipGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
