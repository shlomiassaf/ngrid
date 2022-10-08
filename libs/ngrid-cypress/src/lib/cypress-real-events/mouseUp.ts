import { fireCdpCommand } from './fireCdpCommand';
import { getCypressElementCoordinates, Position, ScrollBehaviorOptions } from './getCypressElementCoordinates';
import { MouseButtonNumbers } from './mouseButtonNumbers';

export interface RealMouseUpOptions {
  /** Pointer type for realMouseUp, if "pen" touch simulated */
  pointer?: "mouse" | "pen";
  /**
   * Position of the realMouseUp event relative to the element
   * @example cy.realMouseUp({ position: "topLeft" })
   */
  position?: Position;
  /**
   * Controls how the page is scrolled to bring the subject into view, if needed.
   * @example cy.realMouseUp({ scrollBehavior: "top" });
   */
  scrollBehavior?: ScrollBehaviorOptions;
  /**
   * @default "left"
   */
  button?: keyof typeof MouseButtonNumbers;
}


export async function realMouseUp(subject: JQuery, x: number , y: number, options: RealMouseUpOptions = {}, inputType: 'relative' | 'absolute' = 'relative') {   
  const log = Cypress.log({
    $el: subject,
    name: "realMouseUp",
    consoleProps: () => ({
      "Applied To": subject.get(0),
      "Absolute Coordinates": { x, y },
    }),
  });
  
  log.snapshot("before");

  if (inputType == 'relative')
  {
    const basePosition = getCypressElementCoordinates(subject, options.position, options.scrollBehavior);
    x = x + basePosition.x;
    y = y + basePosition.y;
  }

  await fireCdpCommand("Input.dispatchMouseEvent", {
    type: "mouseReleased",
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