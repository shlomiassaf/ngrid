import { registerGridHandlers } from './grid-primitives/index';
import { registerColumnOrderHandlers } from './column-order/index';
import { registerColumnVisibilityHandlers } from './column-visibility/index';
import { registerColumnDefHandlers } from './column-def/index';

export function registerBuiltInHandlers() {
  registerGridHandlers();
  registerColumnOrderHandlers();
  registerColumnVisibilityHandlers();
  registerColumnDefHandlers();
}
