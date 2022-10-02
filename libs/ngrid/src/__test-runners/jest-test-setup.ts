import 'jest-preset-angular/setup-jest';

class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}
ResizeObserver['default'] = ResizeObserver;
jest.mock('resize-observer-polyfill', () => ResizeObserver);

