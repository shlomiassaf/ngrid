module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/ngrid-demo-app',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  setupFilesAfterEnv: ['<rootDir>src/__test-runners/jest-test-setup.ts'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>tsconfig.spec.jest.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: [
        'jest-preset-angular/build/InlineFilesTransformer',
        'jest-preset-angular/build/StripStylesTransformer',
      ],
    },
  },
  displayName: 'ngrid-demo-app',
};
