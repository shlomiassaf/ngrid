const basePreset = require('../../jest.preset.js');
module.exports = {
  ...basePreset,
  testMatch: ['**/+(*.)+(spec|test)\.jest.+(ts|js)?(x)']
};
