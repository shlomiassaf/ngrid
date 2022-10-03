const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/ngrid-docs-app/',
    '<rootDir>/libs/ngrid-cypress',
  ],
};
