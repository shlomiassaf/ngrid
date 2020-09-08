module.exports = {
  name: 'ngrid',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ngrid',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
