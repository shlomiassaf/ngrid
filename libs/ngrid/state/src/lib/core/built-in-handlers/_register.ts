import { registerGridHandlers } from './grid-primitives/index';
import { registerColumnOrderHandlers } from './column-order/index';
import { registerColumnVisibilityHandlers } from './column-visibility/index';
import { registerColumnDefHandlers } from './column-def/index';

export function registerBuiltInHandlers() {
  registerGridHandlers();
  registerColumnDefHandlers();
  registerColumnVisibilityHandlers(); // order is important, we want visibility set before ordering
  registerColumnOrderHandlers();
}
