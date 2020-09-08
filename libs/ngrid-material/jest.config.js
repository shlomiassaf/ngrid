module.exports = {
  name: 'ngrid-material',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ngrid-material',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
