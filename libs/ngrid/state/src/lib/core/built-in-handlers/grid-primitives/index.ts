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

export function registerGridHandlers() {
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
      // We must assert the type starting from 3.5 onwards
      // See "Fixes to unsound writes to indexed access types" in https://devblogs.microsoft.com/typescript/announcing-typescript-3-5
      ctx.source[key as any] = stateValue;
    })
    .register();
}
