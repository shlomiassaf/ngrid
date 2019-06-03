import { createStateChunkHandler } from '../../handling';

/* ====================================================================================================================================================== */

createStateChunkHandler('dataColumn')
  .handleKeys(
    'id', 'label', 'css', 'type', 'width', 'minWidth', 'maxWidth',        // PblNgridBaseColumnState (all optional)
    'prop',                                                               // Required
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
      return c[key];
    } else {
      return ctx.source[key];
    }

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
      }
      ctx.source[key] = stateValue;
    }

  })
  .register();

/* ====================================================================================================================================================== */

createStateChunkHandler('dataMetaRow')
  .handleKeys('rowClassName', 'type')    // All Optional
  .serialize( (key, ctx) => {
    return ctx.source[key];
  })
  .deserialize( (key, stateValue, ctx) => {

  })
  .register();

/* ====================================================================================================================================================== */

createStateChunkHandler('metaRow')
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
  .handleKeys(
    'id', 'label', 'css', 'type', 'width', 'minWidth', 'maxWidth',        // PblNgridBaseColumnState (all optional)
    'kind', 'rowIndex',                                                   // Required
  )
  .serialize( (key, ctx) => {
    return ctx.source[key];
  })
  .deserialize( (key, stateValue, ctx) => {

  })
  .register();

/* ====================================================================================================================================================== */

createStateChunkHandler('metaGroupColumn')
  .handleKeys(
    'id', 'label', 'css', 'type', 'width', 'minWidth', 'maxWidth',        // PblNgridBaseColumnState (all optional)
    'prop', 'rowIndex', 'span',                                           // Required
  )
  .serialize( (key, ctx) => {
    return ctx.source[key];
  })
  .deserialize( (key, stateValue, ctx) => {

  })
  .register();
