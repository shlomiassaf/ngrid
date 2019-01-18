# TODO

## Column Reorder - Drag & drop
  
- Column API, allow feat toggling
- Support custom Handle
- Support custom preview?

## Row Reorder - Drag & Drop

- Table API - allow feat toggling

## Column Resize

- Column API, allow feat toggling
- Support custom Handle

## Detail Row

- Add "mode" feature (click, double click, cellClick cellDoubleClick, manual)

## Move finalize decoupling of plugins:

### Move away column/meta-column/column-group property cloning

Some plugins require input through column API definition.

Some of these definitions are set in the column classes coupling the table and plugin.

We need to move these definition to the extension model (see example in column-group `lockColumns` property in column-reorder-plugin)

> Column instances are cloned and the properties cloned are specific, not the entire object.
An extension model is in-place allowing to declare a property to be cloned.

### Find a way to decouple the template reference directive in the registry

Some plugins interact with the table through templates registered in the registry.

The registry is used internally and the user uses a structural directive that abstracts away the registry doing the work inside.

- Some plugin specific directives are defined in the package - need to move them out to the plugin.
- Some plugin specific registry definition are defined in the table - need to move them out to the plugin.
- Some plugins are passive, having the table looking for their specific registry template and inject it - need to move this to the plugin. SEE: cellDragger, cellResizer


aggregation
inf scroll
