import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowHeightTableExampleComponent } from './row-height.component';

describe('RowHeightTableExampleComponent', () => {
  let component: RowHeightTableExampleComponent;
  let fixture: ComponentFixture<RowHeightTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowHeightTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowHeightTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
