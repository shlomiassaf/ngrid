import 'jest-preset-angular';

jest.mock('markdown-pages', () => {
  return {};
}, { virtual: true });
