module.exports = {
  name: 'ngrid',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ngrid',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
