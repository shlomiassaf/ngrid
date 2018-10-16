import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellTooltipTableExampleComponent } from './cell-tooltip.component';

describe('CellTooltipTableExampleComponent', () => {
  let component: CellTooltipTableExampleComponent;
  let fixture: ComponentFixture<CellTooltipTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellTooltipTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellTooltipTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
