module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/ngrid-docs-app',

  setupFilesAfterEnv: ['<rootDir>src/__test-runners/jest-test-setup.ts'],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: [
        'jest-preset-angular/build/InlineFilesTransformer',
        'jest-preset-angular/build/StripStylesTransformer',
      ],
      tsconfig: '<rootDir>tsconfig.spec.jest.json',
    },
  },
  displayName: 'ngrid-docs-app',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
