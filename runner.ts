import { run, createApiReferenceMap } from './libs/docsi/webpack/src/lib/api-reference';

const options = {
  module: "commonjs",
  mode: "modules",
  ignoreCompilerErrors: "true",
  tsconfig: __dirname + '/libs/table/tsconfig.lib.json',

  libraryType: 'monorepo',
  // enforcePublicApi: true
  // libraryType: 'standalone',
  // enforcePublicApi: [
  //   '/Users/shlomiassaf/Desktop/Code/shlomi/__LIB__/neg/libs/table/src/index.ts'
  // ]
};

const ds = run(options);
const apiRefMap = createApiReferenceMap(ds);

console.log(apiRefMap);
