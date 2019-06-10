import { PblNgridComponent } from '@pebula/ngrid';
import { PickPNP } from '../../utils';
import { createStateChunkHandler } from '../../handling';
import { stateVisor } from '../../state-visor';

export interface PblNgridSurfaceState extends
  PickPNP <
    PblNgridComponent,
    'showHeader' | 'showFooter' | 'focusMode' | 'identityProp' | 'usePagination' | 'hideColumns' | 'fallbackMinHeight',
    never
  > { }

stateVisor.registerRootChunkSection(
  'grid',
  {
    sourceMatcher: ctx => ctx.grid,
    stateMatcher: state => state.grid || (state.grid = {} as any)
  }
);

createStateChunkHandler('grid')
  .handleKeys('showHeader', 'showFooter', 'focusMode', 'identityProp', 'usePagination', 'hideColumns', 'fallbackMinHeight')
  .serialize( (key, ctx) => ctx.source[key] )
  .deserialize( (key, stateValue, ctx) => {
    ctx.source[key] = stateValue
  })
  .register();
