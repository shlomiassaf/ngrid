const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/ngrid-docs-app/',
    '<rootDir>/libs/ngrid-cypress',
  ],
};
