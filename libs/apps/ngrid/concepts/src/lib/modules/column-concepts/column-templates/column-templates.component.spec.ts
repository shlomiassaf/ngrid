import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnTemplatesGridExampleComponent } from './column-templates.component';

describe('ColumnTemplatesGridExampleComponent', () => {
  let component: ColumnTemplatesGridExampleComponent;
  let fixture: ComponentFixture<ColumnTemplatesGridExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnTemplatesGridExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnTemplatesGridExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
