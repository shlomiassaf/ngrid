import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnQuickthroughTableExampleComponent } from './column-quickthrough.component';

describe('ColumnQuickthroughTableExampleComponent', () => {
  let component: ColumnQuickthroughTableExampleComponent;
  let fixture: ComponentFixture<ColumnQuickthroughTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnQuickthroughTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnQuickthroughTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
