import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowHeightGridExampleComponent } from './row-height.component';

describe('RowHeightGridExampleComponent', () => {
  let component: RowHeightGridExampleComponent;
  let fixture: ComponentFixture<RowHeightGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowHeightGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowHeightGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
