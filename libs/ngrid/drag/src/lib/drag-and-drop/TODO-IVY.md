# TODO

The classes `CdkLazyDropList` and `CdkLazyDrag` extend the core `CdkDropList` and `CdkDrag` respectively and add lazy binding between the two.

All of the plugins make use of this feature.

- column/aggregation-column.ts
- column/column-reorder-plugin.ts
- row/row-reorder-plugin.ts

In a normal world we would like to have a directive class A that extends `CdkLazyDropList` or `CdkLazyDrag`.

However, currently (angular 7) this is not possible because after creating a library build the output published will have to
go through an AOT build in the apps of the users... This will not go smoothly because all metadata information from `CdkDropList` and `CdkDrag`
is lost and not used. It seems that only 1 inheritance level is possible.

To workaround that all classes in the above files are duplicating code or at best forwarding method calls to the methods on the prototypes of `CdkLazyDropList` or `CdkLazyDrag`.

There is a bright light tough, when the library moves to IVY this should be possible and working...
