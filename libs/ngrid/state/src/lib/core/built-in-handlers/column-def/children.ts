import { PblColumnTypeDefinition } from '@pebula/ngrid';
import { createStateChunkHandler } from '../../handling';

/* ====================================================================================================================================================== */

createStateChunkHandler('dataColumn')
  .requiredKeys('id', 'prop')
  .handleKeys(
    'label', 'css', 'type', 'width', 'minWidth', 'maxWidth',              // PblNgridBaseColumnState (all optional)
    'headerType', 'footerType', 'sort', 'sortAlias', 'editable', 'pin'    // All Optional
  )
  .serialize( (key, ctx) => {
    const c = ctx.data.activeColumn || ctx.data.pblColumn;
    if (c) {
      switch (key) {
        case 'prop':
          return c.orgProp;
        default:
          break;
      }
    }

    const value = c ? c[key] : ctx.source[key];

    switch (key) {
      case 'sort':
        if (typeof value === 'boolean') {
          return value;
        } else {
          return;
        }
      default:
        break;
    }

    return value;
  })
  .deserialize( (key, stateValue, ctx) => {
    const { activeColumn } = ctx.data;
    if (activeColumn) {
      switch (key) {
        case 'width':
          activeColumn.updateWidth(true, stateValue as any);
          break;
      }
    }
    if (ctx.source) {
      switch (key) {
        case 'prop':
          return;
        case 'type':
        case 'headerType':
        case 'footerType':
          const typeValue = ctx.source[key];
          const stateTypeDef: PblColumnTypeDefinition = stateValue as any;
          if (stateTypeDef && typeof stateTypeDef !== 'string' && typeValue && typeof typeValue !== 'string') {
            typeValue.name = stateTypeDef.name;
            if (stateTypeDef.data) {
              typeValue.data = Object.assign(typeValue.data || {}, stateTypeDef.data);
            }
            return;
          }
          break;
      }
      ctx.source[key] = stateValue;
    }

  })
  .register();

/* ====================================================================================================================================================== */

createStateChunkHandler('dataMetaRow')
  .handleKeys('rowClassName', 'type')    // All Optional
  .serialize( (key, ctx) => {
    const active = ctx.data.active || ctx.source;
    if (active) {
      return active[key];
    }
  })
  .deserialize( (key, stateValue, ctx) => ctx.source[key] = stateValue )
  .register();

/* ====================================================================================================================================================== */

createStateChunkHandler('metaRow')
  // Note that we are not handling `cols`, this should be called from the parent, as a different child chunk handling process for each column
  .handleKeys(
    'rowClassName', 'type',    // All Optional like dataMetaRow
    'rowIndex',                // Required
    )
  .serialize( (key, ctx) => {
    return ctx.source[key];
  })
  .deserialize( (key, stateValue, ctx) => {

  })
  .register();

/* ====================================================================================================================================================== */

createStateChunkHandler('metaGroupRow')
  // Note that we are not handling `cols`, this should be called from the parent, as a different child chunk handling process for each column
  .handleKeys(
    'rowClassName', 'type',    // All Optional like dataMetaRow
    'rowIndex',                // Required
    )
  .serialize( (key, ctx) => {
    return ctx.source[key];
  })
  .deserialize( (key, stateValue, ctx) => {

  })
  .register();

/* ====================================================================================================================================================== */

createStateChunkHandler('metaColumn')
  .requiredKeys('kind', 'rowIndex')
  .handleKeys(
    'id', 'label', 'css', 'type', 'width', 'minWidth', 'maxWidth',        // PblNgridBaseColumnState (all optional)
  )
  .serialize( (key, ctx) => {
    return ctx.source[key];
  })
  .deserialize( (key, stateValue, ctx) => {

  })
  .register();

/* ====================================================================================================================================================== */

createStateChunkHandler('metaGroupColumn')
  .requiredKeys('prop', 'rowIndex', 'span')
  .handleKeys(
    'id', 'label', 'css', 'type', 'width', 'minWidth', 'maxWidth',        // PblNgridBaseColumnState (all optional)
  )
  .serialize( (key, ctx) => {
    return ctx.source[key];
  })
  .deserialize( (key, stateValue, ctx) => {

  })
  .register();
