import '@pebula/ngrid-cypress';
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

declare global {
  namespace Cypress {
    interface ResolvedConfigOptions {
      isInteractive: boolean;
    }
  }
}

// if (Cypress.config('isInteractive')) {
//   Cypress.Commands.add('matchImageSnapshot', () => {
//     cy.log('Skipping snapshot 👀')
//   })
// } else {
//   addMatchImageSnapshotCommand({
//     customSnapshotsDir: './src/__snapshots__',
//     failureThreshold: 0.03, // threshold for entire image
//     failureThresholdType: 'percent', // percent of image or number of pixels
//     customDiffConfig: { threshold: 0.1 }, // threshold for each pixel
//     capture: 'viewport', // capture viewport in screenshot
//   });
// }