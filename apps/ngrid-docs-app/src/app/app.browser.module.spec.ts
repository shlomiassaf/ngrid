import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppBrowserModule } from './app.browser.module';

describe('AppBrowserModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppBrowserModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AppBrowserModule).toBeDefined();
  });
});
