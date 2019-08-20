module.exports = {
  name: 'utils',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/utils',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
