module.exports = {
  name: 'ngrid-demo-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/ngrid-demo-app',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
