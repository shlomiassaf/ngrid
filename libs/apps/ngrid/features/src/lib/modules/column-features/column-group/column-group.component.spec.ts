import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnGroupGridExampleComponent } from './column-group.component';

describe('ColumnGroupGridExampleComponent', () => {
  let component: ColumnGroupGridExampleComponent;
  let fixture: ComponentFixture<ColumnGroupGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnGroupGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnGroupGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
