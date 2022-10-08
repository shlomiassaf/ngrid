// import '@pebula/ngrid-cypress';
import type { Options } from 'cypress-image-snapshot';
import '../../../../libs/ngrid-cypress/src/index';
import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';

declare global {
  namespace Cypress {
    interface ResolvedConfigOptions {
      isInteractive: boolean;
    }
  }
}

if (Cypress.config('isInteractive')) {
  Cypress.Commands.add('matchImageSnapshot', () => {
    cy.log('Skipping snapshot 👀')
  })
} else {

  addMatchImageSnapshotCommand({
    customSnapshotsDir: './src/__snapshots__',
    customDiffDir: '../../dist/cypress/apps/ngrid-dev-app-e2e/snapshots_diffs',
    capture: 'viewport', // capture viewport in screenshot
  });
}
