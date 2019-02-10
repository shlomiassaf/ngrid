import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnQuickthroughGridExampleComponent } from './column-quickthrough.component';

describe('ColumnQuickthroughGridExampleComponent', () => {
  let component: ColumnQuickthroughGridExampleComponent;
  let fixture: ComponentFixture<ColumnQuickthroughGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnQuickthroughGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnQuickthroughGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
