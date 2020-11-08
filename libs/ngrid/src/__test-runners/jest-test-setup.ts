import 'jest-preset-angular';

class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

ResizeObserver['default'] = ResizeObserver;

jest.mock('resize-observer-polyfill', () => ResizeObserver);
