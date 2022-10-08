import { fireCdpCommand } from './fireCdpCommand';
import { getCypressElementCoordinates, Position, ScrollBehaviorOptions } from './getCypressElementCoordinates';
import { MouseButtonNumbers } from './mouseButtonNumbers';

export interface RealMouseDownOptions {
  /** Pointer type for realMouseDown, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Position of the realMouseDown event relative to the element
   * @example cy.realMouseDown({ position: "topLeft" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realMouseDown({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;

  /**
   * @default "left"
   */
  button?: keyof typeof MouseButtonNumbers;
}

export async function realMouseDown(subject: JQuery,  options: RealMouseDownOptions = {}) {
  const { x, y } = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);

  const log = Cypress.log({
    $el: subject,
    name: "realMouseDown",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });

  log.snapshot("before");
  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x,
    y,
    clickCount: 1,
    buttons: MouseButtonNumbers[options.button ?? "left"],
    pointerType: options.pointer ?? "mouse",
    button: options.button ?? "left",
  });

  log.snapshot("after").end();

  return subject;
}