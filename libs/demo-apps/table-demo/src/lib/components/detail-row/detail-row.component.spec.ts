import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRowExampleComponent } from './detail-row.component';

describe('DetailRowExampleComponent', () => {
  let component: DetailRowExampleComponent;
  let fixture: ComponentFixture<DetailRowExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRowExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRowExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
