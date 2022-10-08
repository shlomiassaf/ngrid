import { fireCdpCommand } from './fireCdpCommand';
import { getCypressElementCoordinates, Position, ScrollBehaviorOptions } from './getCypressElementCoordinates';

export interface RealMouseMoveOptions {
  /**
   * Initial position for movement
   * @default "topLeft"
   * @example cy.realMouseMove({ position: "topRight" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realClick({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
}

export async function realMouseMove(subject: JQuery, x: number, y: number, options: RealMouseMoveOptions = {}, inputType: 'relative' | 'absolute' = 'relative') {
  const basePosition= getCypressElementCoordinates(
    subject,
    options.position || "topLeft",
    options.scrollBehavior
  );

  const log = Cypress.log({
    $el: subject,
    name: "realMouseMove",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Element Coordinates": basePosition,
    }),
  });

  if (inputType == 'relative')
  {
    const basePosition= getCypressElementCoordinates(subject, options.position || "topLeft", options.scrollBehavior);
    x = x + basePosition.x;
    y = y + basePosition.y;
  }

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  log.snapshot("after").end();

  return subject;
}