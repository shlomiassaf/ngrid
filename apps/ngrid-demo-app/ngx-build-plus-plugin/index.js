"use strict";
const Path = require('path');

function config(cfg) {
  require('tsconfig-paths/register');
  const tsNode = require('ts-node');

  const projectRoot = Path.resolve(__dirname, '..');
  tsNode.register({
    project: Path.resolve(projectRoot, 'tsconfig.es6.json'),
  });

  const additionalConfig = require(Path.resolve(projectRoot, 'webpack.config.ts'));
  return additionalConfig(cfg) || cfg;
}

exports.__esModule = true;
exports["default"] = {
  config,
    // pre: function () { },
    // post: function () { }
};
