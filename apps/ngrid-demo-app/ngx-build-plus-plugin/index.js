"use strict";
const Path = require('path');

function config(cfg) {
  const OLD_TS_NODE_PROJECT = process.env.TS_NODE_PROJECT;

  const projectRoot = Path.resolve(__dirname, '..');
  const project = Path.resolve(projectRoot, 'tsconfig.es6.json');
  process.env.TS_NODE_PROJECT = project;

  require('tsconfig-paths/register');
  const tsNode = require('ts-node');

  tsNode.register({
    project,
  });

  const additionalConfig = require(Path.resolve(projectRoot, 'webpack.config.ts'));

  if (OLD_TS_NODE_PROJECT) {
    process.env.TS_NODE_PROJECT = OLD_TS_NODE_PROJECT;
  } else {
    delete process.env.TS_NODE_PROJECT;
  }

  return additionalConfig(cfg) || cfg;
}

exports.__esModule = true;
exports["default"] = {
  config,
    // pre: function () { },
    // post: function () { }
};
