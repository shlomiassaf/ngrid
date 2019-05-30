import { createStateChunkHandler } from './base';

export {
  createStateChunkHandler,
  PblNgridStateOptions,
  PblNgridStateRestoreOptions,
  PblNgridStateChunkContext,
  PblNgridStateChunkHandlerDefinition,
} from './base';

createStateChunkHandler('grid')
  .handleKeys('showHeader', 'showFooter', 'focusMode', 'identityProp', 'usePagination', 'hideColumns', 'fallbackMinHeight')
  .serialize( (key, ctx) => ctx.source[key] )
  .deserialize( (key, stateValue, ctx) => {
    ctx.source[key] = stateValue
  })
  .register();
