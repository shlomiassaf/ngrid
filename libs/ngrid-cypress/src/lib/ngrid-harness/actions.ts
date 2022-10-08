import "cypress-real-events";
import "cypress-real-events/support";
import { NGridCypressHarness } from './ngrid-harness';

function getCoords(el: Element) {
  const domRect = el.getBoundingClientRect()
  const coords = { x: domRect.left + (domRect.width / 2 || 0), y: domRect.top + (domRect.height / 2 || 0) }
  return coords
}

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
    const sourceEl = this.harness.element.querySelector(`.cdk-column-${sourceColumnId}.cdk-drag`);
    const targetEl = this.harness.element.querySelector(`.cdk-column-${targetColumnId}.cdk-drag`);

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

    const defaultView = sourceEl.ownerDocument.defaultView;
    const elFromCoords = (coords: ReturnType<typeof getCoords>) => defaultView.document.elementFromPoint(coords.x, coords.y);
    const send = (type: string, coords: ReturnType<typeof getCoords>, el?: Element) => {
      el = el || elFromCoords(coords)
      switch (type.substring(0, 4))
      {
        case "mous":
          el.dispatchEvent(new defaultView.MouseEvent(type, Object.assign({}, { clientX: coords.x, clientY: coords.y }, { bubbles: true, cancelable: true, which: 1, button: 0 })));
          break;
        case "poin":
          el.dispatchEvent(new defaultView.PointerEvent(type, Object.assign({}, { clientX: coords.x, clientY: coords.y }, { bubbles: true, cancelable: true, which: 1, button: 0 })));
          break;
        case "drag":
          el.dispatchEvent(new defaultView.DragEvent(type, Object.assign({}, { clientX: coords.x, clientY: coords.y }, { bubbles: true, cancelable: true, dataTransfer: new DataTransfer() })));
          break;
        case "drop":
          el.dispatchEvent(new defaultView.DragEvent(type, Object.assign({}, { clientX: coords.x, clientY: coords.y }, { bubbles: true, cancelable: true, dataTransfer: new DataTransfer() })));
          break;
        default:
          throw new Error("Invalid: " + type);
      }
    }

    const fromCoords = getCoords(sourceEl);
    const toCoords = getCoords(targetEl);

    const _log = Cypress.log({
      $el: Cypress.$(sourceEl as any),
      name: 'drag to',
      message: targetColumnId,
    });

    _log.snapshot('before', { next: 'after', at: 0 });
    _log.set({ consoleProps: () => ({ coords: toCoords }) });

    send('mouseover', fromCoords, sourceEl);
    send('pointerdown', fromCoords, sourceEl);
    send('mousedown', fromCoords, sourceEl);
    send('dragstart', fromCoords, sourceEl);

    return cy.then(() => Cypress.Promise
      .try(() => {
        const steps = opts.steps;
        if (steps > 0) {

          const dx = (toCoords.x - fromCoords.x) / steps;
          const dy = (toCoords.y - fromCoords.y) / steps;

          return Cypress.Promise.map(Array(steps).fill(null), (v, i) => {
            i = steps - 1 - i;

            const _to = {
              x: fromCoords.x + dx * (i),
              y: fromCoords.y + dy * (i),
            };

            send('mousemove', _to, sourceEl);
            send('dragover', _to, sourceEl);
            send('pointermove', _to, sourceEl);

            return Cypress.Promise.delay(opts.delay);

          }, { concurrency: 1 });
        }
      })
      .then(() => {
        send('dragover', toCoords, sourceEl);
        send('pointermove', toCoords, sourceEl);
        send('mousemove', toCoords, sourceEl);

        send('mouseover', toCoords);
        send('mousemove', toCoords);

        send('drop', toCoords);
        send('pointerup', toCoords);
        send('mouseup', toCoords);

        _log.snapshot('after', { at: 1, next: null }).end();
        return this.harness;
      })
    );
  }

  dragMoveColumns1(sourceColumnId: string, targetColumnId: string, opts?: DragOptions): Cypress.Chainable<NGridCypressHarness> {
    const sourceEl = this.harness.element.querySelector(`.cdk-column-${sourceColumnId}.cdk-drag`);
    const targetEl = this.harness.element.querySelector(`.cdk-column-${targetColumnId}.cdk-drag`);

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

    const defaultView = sourceEl.ownerDocument.defaultView;
    const elFromCoords = (coords: ReturnType<typeof getCoords>) => defaultView.document.elementFromPoint(coords.x, coords.y);
    const send = (type: string, coords: ReturnType<typeof getCoords>, el?: Element) => {
      el = el || elFromCoords(coords)
      el.dispatchEvent(new defaultView.MouseEvent(type, Object.assign({}, { clientX: coords.x, clientY: coords.y }, { bubbles: true, cancelable: true })));
    }

    const fromCoords = getCoords(sourceEl);
    const toCoords = getCoords(targetEl);

    const _log = Cypress.log({
      $el: Cypress.$(sourceEl as any),
      name: 'drag to',
      message: targetColumnId,
    });

    _log.set({ consoleProps: () => ({ coords: toCoords }) });

    return cy.then(() => Cypress.Promise.fromNode(c => c(null, this.harness.element)))
      .then(() => Cypress.Promise.fromNode(c => c(null, sourceEl)))
      .realMouseDown({ button: 'left', position: 'center' })
      .realMouseMove(0, 10, { position: 'right' })
      .then(() => Cypress.Promise.fromNode(c => c(null, targetEl)))
      .realMouseMove(0, 0, { position: 'right' })
      .wait(200)
      .realMouseUp()
      .wait(200)
      .then(() => this.harness);
  }
}
