import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnTemplatesTableExampleComponent } from './column-templates.component';

describe('ColumnTemplatesTableExampleComponent', () => {
  let component: ColumnTemplatesTableExampleComponent;
  let fixture: ComponentFixture<ColumnTemplatesTableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnTemplatesTableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnTemplatesTableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
