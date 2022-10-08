import { getCypressElementCoordinates } from '../cypress-real-events/getCypressElementCoordinates';
import { NGridCypressHarness } from './ngrid-harness';
import { realMouseUp } from '../cypress-real-events/mouseUp';
import { realMouseDown } from '../cypress-real-events/mouseDown';
import { realMouseMove } from '../cypress-real-events/mouseMove';
export interface DragOptions {
  /**
   * delay in between steps
   * @default 0
   */
  delay?: number;
  /**
   * interpolation between coords
   * @default 0
   */
  steps?: number;
  /**
   * >=10 steps
   * @default false
   */
  smooth?: boolean;
}

export class NGridCypressHarnessActions {
  constructor(private readonly harness: NGridCypressHarness) { }

  dragMoveColumns(sourceColumnId: string, targetColumnId: string, opts?: DragOptions): Cypress.Chainable<NGridCypressHarness> {
    const sourceEl = this.harness.element.querySelector(`.cdk-column-${sourceColumnId}.cdk-drag`) as HTMLElement;
    const targetEl = this.harness.element.querySelector(`.cdk-column-${targetColumnId}.cdk-drag`) as HTMLElement;

    if (!sourceEl) {
      throw new Error(`Invalid column: ${sourceColumnId}`);
    }
    if (!targetEl) {
      throw new Error(`Invalid column: ${targetColumnId}`);
    }

    opts = Cypress._.defaults(opts, { delay: 0, steps: 0, smooth: false });

    if (opts.smooth) {
      opts.steps = Math.max(opts.steps || 0, 10);
    }

    const _log = Cypress.log({
      $el: Cypress.$(sourceEl as any),
      name: 'drag to',
      message: targetColumnId,
    });
    
    const fromCoords = getCypressElementCoordinates(Cypress.$(sourceEl), 'center', false);
    const toCoords = getCypressElementCoordinates(Cypress.$(targetEl), 'center', false);

    _log.set({ consoleProps: () => ({ coords: toCoords }) });

    var sEl = Cypress.$(sourceEl);
    var tEl = Cypress.$(targetEl);

    return cy.then(() => {
      return Cypress.Promise.resolve(realMouseDown(sEl, { position: "center" }))
        .then(() => Cypress.Promise.resolve(realMouseMove(sEl, toCoords.x - fromCoords.x, toCoords.y, { position: "center" })))
        .then(() => Cypress.Promise.delay(200))
        .then(() => {
          const steps = opts.steps;
          
          if (steps <= 0) {
            return;
          }
  
          const dx = (toCoords.x - fromCoords.x) / steps;
          const dy = (toCoords.y - fromCoords.y) / steps;
  
          return Cypress.Promise.map(Array(steps).fill(null), (v, i) => {
            i = steps - 1 - i;
  
            return Cypress.Promise.resolve(realMouseMove(tEl, fromCoords.x + dx * (i), fromCoords.y + dy * (i), {}, 'absolute'))
            .then(() => Cypress.Promise.delay(opts.delay));
  
          }, { concurrency: 1 });
        })
        .then(() => Cypress.Promise.delay(opts.delay))
        .then(() => Cypress.Promise.resolve(realMouseUp(tEl, toCoords.x, toCoords.y, {}, 'absolute')))
        .then(() => Cypress.Promise.delay(opts.delay))

        .then(() => this.harness);
    });
  }
}

