module.exports = {
  name: 'ngrid-material',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ngrid-material',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
