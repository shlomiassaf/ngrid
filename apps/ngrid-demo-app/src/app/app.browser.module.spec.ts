import { async, TestBed } from '@angular/core/testing';
import { AppBrowserModule } from './app.browser.module';

describe('AppBrowserModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppBrowserModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AppBrowserModule).toBeDefined();
  });
});
