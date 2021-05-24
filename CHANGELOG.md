# 4.0.0-alpha.1 (2021-05-24)


### Bug Fixes

* scss bundles proper export ([7d4c7f3](https://github.com/shlomiassaf/ngrid/commit/7d4c7f33c43d736e77406db2d964636e4829d6dc))
* force export augmenting d.ts files ([f2c60ab](https://github.com/shlomiassaf/ngrid/commit/f2c60ab8910aad3e6775441f71111a6f670cc1e8))


# 4.0.0-alpha.0 (2021-05-23)

## Highlights

### Sass
Sass theming API has been reworked so that clients can take advantage of @use. This includes:

- A single entry point into `@pebula/ngrid`, `@pebula/ngrid-material` and `@pebula/ngrid-bootstrap`
- Renamed functions, mixins, and variables to be a better reflection of what they do
- Applications still using node-sass will need to switch to the sass package
For more information, check out [the new material theming guide](https://github.com/angular/components/blob/25665dcc219fbbb76d0ba7f79982672500f78644/guides/theming.md) and [ngrid's theming docs](https://shlomiassaf.github.io/ngrid/concepts/theming/introduction).
- For convinience, legacy theming API is still availavle at `@pebula/ngrid/theming`, `@pebula/ngrid-material/theming` and `@pebula/ngrid-bootstrap/theming`. The legacy API will be removed in v5.0.0

### IVY APF v12

Starting from version 4 of **nGrid**, the library is packaged using the new IVY [**A**ngular **P**acakge **F**ormat (v12)](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs) in [partial-ivy mode](https://angular.io/guide/creating-libraries#transitioning-libraries-to-partial-ivy-format) which is the recommended approach by the angular team.

It is still new and has [it's quirks](https://github.com/angular/angular/issues/42208) which required some shellow API changes to work around it's issues.  
There should be no effect, however, if you experience strange behaviour please report.

In addition, symboles exposes in public modules are now required to be exposed in the public API as well. This resulted in multiple symboles which were previously private now exposed.  

### Aligned with v12 of the angular eco-system

Library is now on par with version 12 of `angular`, `@angular/cdk` and `@angular/components` (material).

Since `nGrid@v4` is IVY compiled and the CDK does not support previous versions, v4 of **nGrid** will only run on angular version 12 and up. 

### Bug Fixes

* **sort:** support empty strings when sorting ([6a1023e](https://github.com/shlomiassaf/ngrid/commit/6a1023e066a297f6b87c8a37554fc73ac723e114))



## 3.1.4 (2021-04-08)


### Bug Fixes

* **ngrid/target-events:** underfined rowContext ([80d0e9d](https://github.com/shlomiassaf/ngrid/commit/80d0e9dd796f96c46262abf61174d528ec6f2fd2)), closes [#181](https://github.com/shlomiassaf/ngrid/issues/181)



## 3.1.3 (2021-03-31)


### Bug Fixes

* **ngrid:** autofit is not accurate ([55b5c75](https://github.com/shlomiassaf/ngrid/commit/55b5c75c05f03ef55aab367136cdfb20619b5b21)), closes [#172](https://github.com/shlomiassaf/ngrid/issues/172)



## 3.1.2 (2021-03-31)


### Bug Fixes

* **ngrid/sticky:** refactor sticky columns to work again ([bacd12a](https://github.com/shlomiassaf/ngrid/commit/bacd12af6509da970112ebd08f3ded9079efa5ad)), closes [#160](https://github.com/shlomiassaf/ngrid/issues/160)
* proper boolean template type for strict type checking ([9a29552](https://github.com/shlomiassaf/ngrid/commit/9a295526febdca175c68ab3532b1c0291a02c7c1))



## 3.1.1 (2021-03-22)


### Bug Fixes

* rebuild all cells context instead of only the visible upon onInvalidateHeaders event ([5779d94](https://github.com/shlomiassaf/ngrid/commit/5779d942346ead4cbe47732b8e0400a0e6534993))



# 3.1.0 (2021-03-07)


### Bug Fixes

* **ngrid:** wrong tracking of removed columns ([c75334d](https://github.com/shlomiassaf/ngrid/commit/c75334df6cb68d9b4db7020fff4b7b3e4e289c15))
* **ngrid:** refactor to support CDK & Material breaking changes ([f3eba68](https://github.com/shlomiassaf/ngrid/commit/f3eba6823a8dc7a2c5d434573af7540bed3c70d0)), closes [#161](https://github.com/shlomiassaf/ngrid/issues/161)



## 3.0.1 (2021-03-04)


### Bug Fixes

* **ngrid:** value and col args in transform function ([fbe95e4](https://github.com/shlomiassaf/ngrid/commit/fbe95e4b2cd7a63a57f71e20ad69fff5199e8b00))



# 3.0.0 (2020-12-30)


### Bug Fixes

* **ngrid:** don't attach global templates to the root registry ([0494678](https://github.com/shlomiassaf/ngrid/commit/0494678c09ff3412cf16f8ae08a199f98f069bd6))
* **ngrid:** fix group logic ([e75e493](https://github.com/shlomiassaf/ngrid/commit/e75e493d45c83f97b0bb0aae87d0aab821a811f5))
* **ngrid:** fix virtual page height ([633a37d](https://github.com/shlomiassaf/ngrid/commit/633a37d0321a6b5ba92da037e381e5fbce18bc38))
* **ngrid:** pagination reset when filter is on ([468de4f](https://github.com/shlomiassaf/ngrid/commit/468de4f569386d9ec032d59f74f5083d0f82e531)), closes [#78](https://github.com/shlomiassaf/ngrid/issues/78)
* **ngrid:** column header sticky rows index is wrong ([c122e9d](https://github.com/shlomiassaf/ngrid/commit/c122e9da60a0d06f43e746c768b2884c4138982c))
* **ngrid/drag:** support column & row reorder on the same host ([c1312c9](https://github.com/shlomiassaf/ngrid/commit/c1312c9cb51ded8b0f308dd598bbcfe0c3620ca6))
* **ngrid/drag:** support row reordering in virtual scroll ([5a24eec](https://github.com/shlomiassaf/ngrid/commit/5a24eecf56bf33ef4fae75feca8360cfeaee441f))
* **ngrid/infinite-scroll:** scroll page init without reason ([54a1b65](https://github.com/shlomiassaf/ngrid/commit/54a1b655474f47d68a04d110bddb3095c3782d93))
* **ngrid:** do not auto-clear context on source changing ([e49d4ff](https://github.com/shlomiassaf/ngrid/commit/e49d4ff1c3ebcbe65219e1e48bff2c1c3e18779b))
* **ngrid:** missed a row when measuring virtual height ([cf9ebfe](https://github.com/shlomiassaf/ngrid/commit/cf9ebfe33bc62be065fcb112249568e64c71e243))
* **ngrid:** rtl not working with live changes in direction ([2956192](https://github.com/shlomiassaf/ngrid/commit/29561925478b58bb660d198c0de64941d10cc4f4)), closes [#141](https://github.com/shlomiassaf/ngrid/issues/141)
* **ngrid:** workaround virtual scroll height limitation in browsers ([233e3b2](https://github.com/shlomiassaf/ngrid/commit/233e3b2b4dc1f66ac8df5cc309488446c64926e6))
* **ngrid:** wrong ds index reference in context when using multirow setup ([58ab268](https://github.com/shlomiassaf/ngrid/commit/58ab2684e695e46bf99450d274f218e1c91e40f2))
* **ngrid/block-ui:** allow BooleanInput for strict mode ([2a9770a](https://github.com/shlomiassaf/ngrid/commit/2a9770a55c0e9a71bb6d96453dc7d876012a61f0))
* **ngrid/block-ui:** wait for grid init before creating view ([b9d1ea3](https://github.com/shlomiassaf/ngrid/commit/b9d1ea38fb148a992a08ef3ca9a5fc503b105a4e))
* **ngrid/infinite-scroll:** proper reflection of refresh trigger state vs infitie scroll trigger state ([3340bc9](https://github.com/shlomiassaf/ngrid/commit/3340bc98b7ceb1369ac4d2fb7a04defb3a311927))
* **ngrid/target-events:** keyboard focus does not sync when virtual scrolling ([b488d91](https://github.com/shlomiassaf/ngrid/commit/b488d917745becc5116e95d10dfcc27b0ff40029)), closes [#117](https://github.com/shlomiassaf/ngrid/issues/117)

### Features

* **ngrid-bootstrap:** selection column ([ab09209](https://github.com/shlomiassaf/ngrid/commit/ab09209a3f24ebe29d1cd5b74da79b7beeaaf35f))
* **ngrid:** add schematics support ([1d7814c](https://github.com/shlomiassaf/ngrid/commit/1d7814cd75291da530c6ed61741841879b4acf68))
* **ngrid-bootstrap:** initial bootstrap support ([80d6a85](https://github.com/shlomiassaf/ngrid/commit/80d6a852660828c5ac12a9a99370cedebcbeeaf4))
* **ngrid:** 3rd party storage for context api ([#132](https://github.com/shlomiassaf/ngrid/issues/132)) ([0c9ca4c](https://github.com/shlomiassaf/ngrid/commit/0c9ca4c2a04750976e92d511b9cc8d46c85220f1)), closes [#10](https://github.com/shlomiassaf/ngrid/issues/10) [#127](https://github.com/shlomiassaf/ngrid/issues/127)
* **ngrid:** allow minimum height based on row count ([296fe5d](https://github.com/shlomiassaf/ngrid/commit/296fe5d2f7b0c5c10800da87717ee43df6713e7e))
* **ngrid:** cache when rendering rows ([170c2d4](https://github.com/shlomiassaf/ngrid/commit/170c2d406d6ba16bd3de30cf164984f988e7cd2c))
* **ngrid:** custom row override ([fec9445](https://github.com/shlomiassaf/ngrid/commit/fec9445c786a83e7eddd353182aa60a7a159df65))
* **ngrid:** implement dynamic virtual scroll strategy ([30117a3](https://github.com/shlomiassaf/ngrid/commit/30117a37223a601791ad4b0df3e78b0021f6799e))
* **ngrid:** new api to add/remove columns ([7a79b2e](https://github.com/shlomiassaf/ngrid/commit/7a79b2e258f9125ad9375c7ea38fe56f18029de3))
* **ngrid:** use intersection observer ([161371b](https://github.com/shlomiassaf/ngrid/commit/161371b34887ced340e2d16df1fe2438b48615a8))
* **ngrid-cypress:** new package with cypress helpers (similar to harnesses) ([e33d638](https://github.com/shlomiassaf/ngrid/commit/e33d638fb6c459fd9094fbb07e8a8f3a6a2b4b7a))
* **ngrid/detail-row:** implement global detail row instance manager ([f30c335](https://github.com/shlomiassaf/ngrid/commit/f30c33577d924a9ee3e171da89e93866fb02d1ba))
* **ngrid/testing:** add test harnesses for ngrid, columns and data rows/cells ([19bbba6](https://github.com/shlomiassaf/ngrid/commit/19bbba66a7758313930fefcc8742a534159211df))

### Performance Improvements

* **ngrid:** support tree-shakable errors ([0fa90ff](https://github.com/shlomiassaf/ngrid/commit/0fa90ffe4a355643713078fda790de04c3b72691))
* **ngrid:** disable wheel mode when virtual scroll paging is active ([25d269e](https://github.com/shlomiassaf/ngrid/commit/25d269eb3a79c417b96a6e1ce17215e949a7cbb2))
* **ngrid:** rebuild columns/cells inside rows when invalidating ([35bbea8](https://github.com/shlomiassaf/ngrid/commit/35bbea8cd15105910f5b45584825ba3fd7848145))
* **ngrid:** use internal row context ([f7f8367](https://github.com/shlomiassaf/ngrid/commit/f7f8367a2b30cd88a029db62040d36bd6d566ac4))

### Code Refactoring

* **ngrid:** move column (some) and datasource symbols to core package ([33d2bca](https://github.com/shlomiassaf/ngrid/commit/33d2bca06efd27e3605489697005d250dfb0780b))
* **ngrid:** move configuration symbols to core package ([fc259ba](https://github.com/shlomiassaf/ngrid/commit/fc259ba343a98880bf9ccc39b9c6808007413f7d))
* **ngrid:** move most of utils to `@pebula/ngrid/core` ([2990511](https://github.com/shlomiassaf/ngrid/commit/2990511c5bf3e68716bf2c08c87577fd6b2dc946))
* **ngrid:** move registry to core package ([55e8f31](https://github.com/shlomiassaf/ngrid/commit/55e8f311691394cb2fe2bcbbd76fa5169d72ad15))
* **ngrid:** moved pagination types to core ([cad0f5b](https://github.com/shlomiassaf/ngrid/commit/cad0f5bf13b9b1a57dcf304be0da797c524820be))
* **ngrid:** refactor the cell rendering engine and refactor the group definitions ([4882e4a](https://github.com/shlomiassaf/ngrid/commit/4882e4a1064d01aefab792ea6d984ba51bb5f70e)), closes [#123](https://github.com/shlomiassaf/ngrid/issues/123) [#131](https://github.com/shlomiassaf/ngrid/issues/131)
* **ngrid:** simplify working with rows ([a81b1af](https://github.com/shlomiassaf/ngrid/commit/a81b1afdc75f3a5c0fd8c9378a7519609c2d1dce))

### BREAKING CHANGES

* **ngrid:** To reduce clutter in the main packge the configuration symbols moved to `@pebula/ngrid/core`.
At this point all symbols were re-exported from the main module so this no effect there. However, if you've extended on of the symbols using augmentation you will need to update the augmentation module path.
* **ngrid:** To reduce clutter in the main packge the datasource symbols (all) and some of the column model symbols moved to `@pebula/ngrid/core`.
At this point all symbols we're re-exported from the main module so this no effect there. However, if you've extended on of the symbols using augmentation you will need to update the augmentation module path.
* **ngrid:** Since the registry and it's type mapping symbols are for intenral or plugin use they are now part of the core pacakge. Currently the single/multi directives are still in the main package but they might also be moved in a later phase
* **ngrid:** If you've used `unrx` in your code, it is not located in `@pebula/ngrid/core` since it is not for used by "regular" users, only required for plugin authoring.
* **ngrid:** Pagination types have moved from `@pebula/ngrid` to `@pebula/ngrid/core` as part of the cleanup process to simplify the main package. `@pebula/ngrid` re-exports the interfaces and types but the concrete implementations for `PblPagingPaginator` and `PblTokenPaginator` are now in the core pacakge as they are
not intended to be used by "regular" users, only plugin authors.
* **ngrid:** Binding `[grid]` and `[row]` is no longer required. Same for `detailRow` and `infiniteRow`
* **ngrid:** `resize-observer-polyfill` is no longer a peerDependency and is not required by the library. If you want polyfill support please import the polyfill using polyfill.ts
* **ngrid:** `prop` and `span` are deprecated from `PblColumnGroupDefinition` and will be removed from version 4.0.0
`prop` and `span` are removed from `PblColumnGroup` and instread columnIds list is used
* **ngrid:** If you used the hideColumns property (setter only) via code and not via html binding it will no longer work.
Instead, use the new api to add/remove columns.
If you used it via bindings, it will still work but it is not recommended because other plugins that use the API
will override values from the array provided.



# 3.0.0-alpha.6 (2020-12-30)


### Bug Fixes

* **ngrid:** don't attach global templates to the root registry ([0494678](https://github.com/shlomiassaf/ngrid/commit/0494678c09ff3412cf16f8ae08a199f98f069bd6))


### Features

* **ngrid-bootstrap:** selection column ([ab09209](https://github.com/shlomiassaf/ngrid/commit/ab09209a3f24ebe29d1cd5b74da79b7beeaaf35f))
* **ngrid:** add schematics support ([1d7814c](https://github.com/shlomiassaf/ngrid/commit/1d7814cd75291da530c6ed61741841879b4acf68))


# 3.0.0-alpha.5 (2020-12-28)


### Bug Fixes

* **ngrid:** fix group logic ([e75e493](https://github.com/shlomiassaf/ngrid/commit/e75e493d45c83f97b0bb0aae87d0aab821a811f5))
* **ngrid:** fix virtual page height ([633a37d](https://github.com/shlomiassaf/ngrid/commit/633a37d0321a6b5ba92da037e381e5fbce18bc38))
* **ngrid:** pagination reset when filter is on ([468de4f](https://github.com/shlomiassaf/ngrid/commit/468de4f569386d9ec032d59f74f5083d0f82e531)), closes [#78](https://github.com/shlomiassaf/ngrid/issues/78)


### Features

* **ngrid-bootstrap:** initial bootstrap support ([80d6a85](https://github.com/shlomiassaf/ngrid/commit/80d6a852660828c5ac12a9a99370cedebcbeeaf4))


### Performance Improvements

* **ngrid:** support tree-shakable errors ([0fa90ff](https://github.com/shlomiassaf/ngrid/commit/0fa90ffe4a355643713078fda790de04c3b72691))



# 3.0.0-alpha.4 (2020-12-21)


### Reverts

* **ngrid:** PblNgridRegistryService back to main package ([9a194e8](https://github.com/shlomiassaf/ngrid/commit/9a194e84b3145510e1936cccecb2dfd6805dff8a))



# 3.0.0-alpha.3 (2020-12-21)


### Bug Fixes

* **ngrid:** column header sticky rows index is wrong ([c122e9d](https://github.com/shlomiassaf/ngrid/commit/c122e9da60a0d06f43e746c768b2884c4138982c))
* **ngrid/drag:** support column & row reorder on the same host ([c1312c9](https://github.com/shlomiassaf/ngrid/commit/c1312c9cb51ded8b0f308dd598bbcfe0c3620ca6))
* **ngrid/drag:** support row reordering in virtual scroll ([5a24eec](https://github.com/shlomiassaf/ngrid/commit/5a24eecf56bf33ef4fae75feca8360cfeaee441f))
* **ngrid/infinite-scroll:** scroll page init without reason ([54a1b65](https://github.com/shlomiassaf/ngrid/commit/54a1b655474f47d68a04d110bddb3095c3782d93))


### Code Refactoring

* **ngrid:** move column (some) and datasource symbols to core package ([33d2bca](https://github.com/shlomiassaf/ngrid/commit/33d2bca06efd27e3605489697005d250dfb0780b))
* **ngrid:** move configuration symbols to core package ([fc259ba](https://github.com/shlomiassaf/ngrid/commit/fc259ba343a98880bf9ccc39b9c6808007413f7d))
* **ngrid:** move most of utils to `@pebula/ngrid/core` ([2990511](https://github.com/shlomiassaf/ngrid/commit/2990511c5bf3e68716bf2c08c87577fd6b2dc946))
* **ngrid:** move registry to core package ([55e8f31](https://github.com/shlomiassaf/ngrid/commit/55e8f311691394cb2fe2bcbbd76fa5169d72ad15))
* **ngrid:** moved pagination types to core ([cad0f5b](https://github.com/shlomiassaf/ngrid/commit/cad0f5bf13b9b1a57dcf304be0da797c524820be))


### Performance Improvements

* **ngrid:** disable wheel mode when virtual scroll paging is active ([25d269e](https://github.com/shlomiassaf/ngrid/commit/25d269eb3a79c417b96a6e1ce17215e949a7cbb2))


### BREAKING CHANGES

* **ngrid:** To reduce clutter in the main packge the configuration symbols moved to `@pebula/ngrid/core`.
At this point all symbols were re-exported from the main module so this no effect there. However, if you've extended on of the symbols using augmentation you will need to update the augmentation module path.
* **ngrid:** To reduce clutter in the main packge the datasource symbols (all) and some of the column model symbols moved to `@pebula/ngrid/core`.
At this point all symbols we're re-exported from the main module so this no effect there. However, if you've extended on of the symbols using augmentation you will need to update the augmentation module path.
* **ngrid:** Since the registry and it's type mapping symbols are for intenral or plugin use they are now part of the core pacakge. Currently the single/multi directives are still in the main package but they might also be moved in a later phase
* **ngrid:** If you've used `unrx` in your code, it is not located in `@pebula/ngrid/core` since it is not for used by "regular" users, only required for plugin authoring.
* **ngrid:** Pagination types have moved from `@pebula/ngrid` to `@pebula/ngrid/core` as part of the cleanup process to simplify the main package. `@pebula/ngrid` re-exports the interfaces and types but the concrete implementations for `PblPagingPaginator` and `PblTokenPaginator` are now in the core pacakge as they are
not intended to be used by "regular" users, only plugin authors.



# 3.0.0-alpha.2 (2020-12-03)


### Bug Fixes

* **ngrid:** do not auto-clear context on source changing ([e49d4ff](https://github.com/shlomiassaf/ngrid/commit/e49d4ff1c3ebcbe65219e1e48bff2c1c3e18779b))
* **ngrid:** missed a row when measuring virtual height ([cf9ebfe](https://github.com/shlomiassaf/ngrid/commit/cf9ebfe33bc62be065fcb112249568e64c71e243))
* **ngrid:** rtl not working with live changes in direction ([2956192](https://github.com/shlomiassaf/ngrid/commit/29561925478b58bb660d198c0de64941d10cc4f4)), closes [#141](https://github.com/shlomiassaf/ngrid/issues/141)
* **ngrid:** workaround virtual scroll height limitation in browsers ([233e3b2](https://github.com/shlomiassaf/ngrid/commit/233e3b2b4dc1f66ac8df5cc309488446c64926e6))
* **ngrid:** wrong ds index reference in context when using multirow setup ([58ab268](https://github.com/shlomiassaf/ngrid/commit/58ab2684e695e46bf99450d274f218e1c91e40f2))
* **ngrid/block-ui:** allow BooleanInput for strict mode ([2a9770a](https://github.com/shlomiassaf/ngrid/commit/2a9770a55c0e9a71bb6d96453dc7d876012a61f0))
* **ngrid/block-ui:** wait for grid init before creating view ([b9d1ea3](https://github.com/shlomiassaf/ngrid/commit/b9d1ea38fb148a992a08ef3ca9a5fc503b105a4e))
* **ngrid/infinite-scroll:** proper reflection of refresh trigger state vs infitie scroll trigger state ([3340bc9](https://github.com/shlomiassaf/ngrid/commit/3340bc98b7ceb1369ac4d2fb7a04defb3a311927))
* **ngrid/target-events:** keyboard focus does not sync when virtual scrolling ([b488d91](https://github.com/shlomiassaf/ngrid/commit/b488d917745becc5116e95d10dfcc27b0ff40029)), closes [#117](https://github.com/shlomiassaf/ngrid/issues/117)


### Code Refactoring

* **ngrid:** refactor the cell rendering engine and refactor the group definitions ([4882e4a](https://github.com/shlomiassaf/ngrid/commit/4882e4a1064d01aefab792ea6d984ba51bb5f70e)), closes [#123](https://github.com/shlomiassaf/ngrid/issues/123) [#131](https://github.com/shlomiassaf/ngrid/issues/131)
* **ngrid:** simplify working with rows ([a81b1af](https://github.com/shlomiassaf/ngrid/commit/a81b1afdc75f3a5c0fd8c9378a7519609c2d1dce))


### Features

* **ngrid:** 3rd party storage for context api ([#132](https://github.com/shlomiassaf/ngrid/issues/132)) ([0c9ca4c](https://github.com/shlomiassaf/ngrid/commit/0c9ca4c2a04750976e92d511b9cc8d46c85220f1)), closes [#10](https://github.com/shlomiassaf/ngrid/issues/10) [#127](https://github.com/shlomiassaf/ngrid/issues/127)
* **ngrid:** allow minimum height based on row count ([296fe5d](https://github.com/shlomiassaf/ngrid/commit/296fe5d2f7b0c5c10800da87717ee43df6713e7e))
* **ngrid:** cache when rendering rows ([170c2d4](https://github.com/shlomiassaf/ngrid/commit/170c2d406d6ba16bd3de30cf164984f988e7cd2c))
* **ngrid:** custom row override ([fec9445](https://github.com/shlomiassaf/ngrid/commit/fec9445c786a83e7eddd353182aa60a7a159df65))
* **ngrid:** implement dynamic virtual scroll strategy ([30117a3](https://github.com/shlomiassaf/ngrid/commit/30117a37223a601791ad4b0df3e78b0021f6799e))
* **ngrid:** new api to add/remove columns ([7a79b2e](https://github.com/shlomiassaf/ngrid/commit/7a79b2e258f9125ad9375c7ea38fe56f18029de3))
* **ngrid:** use intersection observer ([161371b](https://github.com/shlomiassaf/ngrid/commit/161371b34887ced340e2d16df1fe2438b48615a8))
* **ngrid-cypress:** new package with cypress helpers (similar to harnesses) ([e33d638](https://github.com/shlomiassaf/ngrid/commit/e33d638fb6c459fd9094fbb07e8a8f3a6a2b4b7a))
* **ngrid/detail-row:** implement global detail row instance manager ([f30c335](https://github.com/shlomiassaf/ngrid/commit/f30c33577d924a9ee3e171da89e93866fb02d1ba))
* **ngrid/testing:** add test harnesses for ngrid, columns and data rows/cells ([19bbba6](https://github.com/shlomiassaf/ngrid/commit/19bbba66a7758313930fefcc8742a534159211df))


### Performance Improvements

* **ngrid:** rebuild columns/cells inside rows when invalidating ([35bbea8](https://github.com/shlomiassaf/ngrid/commit/35bbea8cd15105910f5b45584825ba3fd7848145))
* **ngrid:** use internal row context ([f7f8367](https://github.com/shlomiassaf/ngrid/commit/f7f8367a2b30cd88a029db62040d36bd6d566ac4))


### BREAKING CHANGES

* **ngrid:** Binding `[grid]` and `[row]` is no longer required. Same for `detailRow` and `infiniteRow`
* **ngrid:** `resize-observer-polyfill` is no longer a peerDependency and is not required by the library. If you want polyfill support please import the polyfill using polyfill.ts
* **ngrid:** `prop` and `span` are deprecated from `PblColumnGroupDefinition` and will be removed from version 4.0.0

`prop` and `span` are removed from `PblColumnGroup` and instread columnIds list is used
* **ngrid:** If you used the hideColumns property (setter only) via code and not via html binding it will no longer work.
Instead, use the new api to add/remove columns.
If you used it via bindings, it will still work but it is not recommended because other plugins that use the API
will override values from the array provided.



## 2.3.1 (2020-12-03)


### Bug Fixes

* **ngrid:** support dynamic RTL layout change ([1520f29](https://github.com/shlomiassaf/ngrid/commit/1520f291a5280b11737edbf43d51eb06391fc76d))
* **ngrid/overlay-panel:** change detection is disconnected when opening panels ([b95eb50](https://github.com/shlomiassaf/ngrid/commit/b95eb50348d5a74da91bd8059653384c4d5db882)), closes [#95](https://github.com/shlomiassaf/ngrid/issues/95)




# 2.3.0 (2020-11-01)


### Bug Fixes

* **ngrid/infinite-scroll:** proper handling of refresh with infinite scroll ([9532b71](https://github.com/shlomiassaf/ngrid/commit/9532b71733dda034903f76e06bf058b38668a4d9)), closes [#124](https://github.com/shlomiassaf/ngrid/issues/124)


### Features

* **ngrid:** add RTL support ([5488ad9](https://github.com/shlomiassaf/ngrid/commit/5488ad94a1a2864d51fd460d81b92c18c3414543))



## 2.2.2 (2020-10-28)


### Bug Fixes

* **ngrid:** remove deep covariance generic constraint ([110ccd4](https://github.com/shlomiassaf/ngrid/commit/110ccd42de1f28841224c804f77bf5a51a384f67)), closes [#121](https://github.com/shlomiassaf/ngrid/issues/121)
* **ngrid:** remove duplicate rendering of header cells ([be9036d](https://github.com/shlomiassaf/ngrid/commit/be9036dcd46abbd82c67a1c7e0467431cfbd17a6))
* **ngrid/infinite-scroll:** handle partial range results ([c104069](https://github.com/shlomiassaf/ngrid/commit/c104069f0486bd8cb8d5da2ad19224ae9bdbb3e9)), closes [#125](https://github.com/shlomiassaf/ngrid/issues/125)
* **ngrid/infinite-scroll:** proper handling of custom triggers ([0e32499](https://github.com/shlomiassaf/ngrid/commit/0e3249968c0e036daadf68d3cf6f46eb2c36a0fe)), closes [#124](https://github.com/shlomiassaf/ngrid/issues/124)



## 2.2.1 (2020-10-13)


### Bug Fixes

* **ngrid-material/selection-column:** disable animation to prevent flickering ([7b45329](https://github.com/shlomiassaf/ngrid/commit/7b4532985855cfe43e4b0fce6ca6f0fec615e1fc))
* **ngrid-material/selection-column:** reset listeners when bulk mode changes ([e802997](https://github.com/shlomiassaf/ngrid/commit/e8029973901881846b49ff920d8b27c0a90244e9))
* **ngrid** columnDef override error ([e6dbf9c](https://github.com/shlomiassaf/ngrid/commit/e6dbf9c48f9459006215c7c0d2219f113e23c978)), closes [#118](https://github.com/shlomiassaf/ngrid/issues/118)



# 2.2.0 (2020-10-13)


### Bug Fixes

* **ngrid:** detect edge case where row index might be out of sync ([5ac6496](https://github.com/shlomiassaf/ngrid/commit/5ac6496f82f1459b114de2b4efb418df4205d018))
* **ngrid:** fix memory leak when registering for create ([db003dd](https://github.com/shlomiassaf/ngrid/commit/db003dd6f3dec763f2559508718b67cf617a70b1))


### Features

* **ngrid/infinite-scroll:** implement infinite scroll ([a08c977](https://github.com/shlomiassaf/ngrid/commit/a08c97740c4a33b870828d5443e3edb40fb0ed6e))



# 2.1.0 (2020-09-24)


### Bug Fixes

* **ngrid:** align with CDK changes ([ebd7aa9](https://github.com/shlomiassaf/ngrid/commit/ebd7aa97f86aa958787be2fa72d6ae384ce54bbf))



# 2.0.0 (2020-07-15)


### Refactor

* **ngrid:** remove all deprecated code (v7, v8) ([a2dd3f4](https://github.com/shlomiassaf/ngrid/commit/a2dd3f43f71af9cab667f0ef6d1313f683409d75)), closes [#108](https://github.com/shlomiassaf/ngrid/issues/108)

### Bug Fixes

* **ngrid:** hideColumns not saved by StatePersistence ([10258ab](https://github.com/shlomiassaf/ngrid/commit/10258ab5c70c1af03daca6290592c668ecdaf1d3)), closes [#99](https://github.com/shlomiassaf/ngrid/issues/99)



# 2.0.0-rc.3 (2020-07-14)


### Refactor

* **ngrid:** upgrade to angular 10, cdk 10 and material 10 ([40c091e](https://github.com/shlomiassaf/ngrid/commit/40c091e))



# 2.0.0-rc.2 (2020-04-21)


### Refactor

* **ngrid:** remove UnRx as decorator (fixes [#92](https://github.com/shlomiassaf/ngrid/issues/92)) ([733cf71](https://github.com/shlomiassaf/ngrid/commit/733cf71))
* **ngrid:** dont use decorators for NgridPlugin (fixes [#92](https://github.com/shlomiassaf/ngrid/issues/92)) ([703b4b3](https://github.com/shlomiassaf/ngrid/commit/703b4b3))

### BREAKING CHANGES

* **ngrid:** If you created a custom plugin which required registration, registration is not longer supported using decorators. Instead, register using the ngridPlugin method.



# 2.0.0-rc.1 (2020-03-15)


### Bug Fixes

* **ngrid:** allow running in ViewEngine mode (fixes [#84](https://github.com/shlomiassaf/ngrid/issues/84)) ([#86](https://github.com/shlomiassaf/ngrid/issues/86)) ([fad8409](https://github.com/shlomiassaf/ngrid/commit/fad8409))
* **ngrid/drag:** fully implement interface ([66f896b](https://github.com/shlomiassaf/ngrid/commit/66f896b))



# 2.0.0-rc.0 (2020-03-13)


### Features

* **ngrid:** support angular 9 (#79) ([9f80f9e](https://github.com/shlomiassaf/ngrid/commit/9f80f9e))



# 1.0.0-rc.20 (2020-03-03)


### Bug Fixes

* **ngrid/drag:** sneaky issue with PblDragDrop and AOT ([5eb6929](https://github.com/shlomiassaf/ngrid/commit/5eb6929))



# 1.0.0-rc.17 (2020-02-23)


### Bug Fixes

* **ngrid/clipboard:** copy rows in logical order ([be53250](https://github.com/shlomiassaf/ngrid/commit/be53250))



# 1.0.0-rc.16 (2020-01-16)


### Bug Fixes

* **ngrid:** document.contains fails on IE ([bdc4b10](https://github.com/shlomiassaf/ngrid/commit/bdc4b10))



# 1.0.0-rc.15 (2020-01-16)


### Bug Fixes

* **ngrid:** breaking change in cdk/drag ([7c9e4fe](https://github.com/shlomiassaf/ngrid/commit/7c9e4fe))



# 1.0.0-rc.14 (2020-01-16)


### Bug Fixes

* **ngrid:** unable to use cdk-drag with ngrid ([20250cb](https://github.com/shlomiassaf/ngrid/commit/20250cb)), closes [#72](https://github.com/shlomiassaf/ngrid/issues/72)



# 1.0.0-rc.13 (2019-12-10)


### Bug Fixes

* **ngrid:** proper width's in FF ([83cd3e5](https://github.com/shlomiassaf/ngrid/commit/83cd3e5)), closes [#69](https://github.com/shlomiassaf/ngrid/issues/69)



# 1.0.0-rc.12 (2019-11-22)


### Code Refactoring

* **ngrid:** terminology, change from 'table'  to 'grid' ([4ca1a1e](https://github.com/shlomiassaf/ngrid/commit/4ca1a1e))

* **ngrid:** refactor(ngrid): width in isolation ([a6d9290](https://github.com/shlomiassaf/ngrid/commit/a6d9290))

### BREAKING CHANGES

* **ngrid:** This refactor changes the terminology used by the library from legacy "table" references to "grid" references.
This refactor addressed filenames and property names but did not include literal string names, and property names of configuration objects (e.g. configs...)  so functions that accepted 'table' will still accept it.
Filenames change should not have any effect unless you are extending the types using TS augmentation so any `declare module '@pebula/ngrid/lib/table/...` will have to change.
For property names, all private/protected references to `table` are now `grid` and also all public references, however is most public ref's a getter was added to support the `table` property, with a `@deprecated` JSDoc annotation



# 1.0.0-rc.11 (2019-11-20)


### Bug Fixes

* **ngrid-material:** not reflecting sort state when predefined ([96611bb](https://github.com/shlomiassaf/ngrid/commit/96611bb)), closes [#61](https://github.com/shlomiassaf/ngrid/issues/61)


### Code Refactoring

* **ngrid:** refactor width change detection ([4ba3ae0](https://github.com/shlomiassaf/ngrid/commit/4ba3ae0))



# 1.0.0-rc.10 (2019-11-19)


### Bug Fixes

* **core:** make sure minWidth is updated ([699b4aa](https://github.com/shlomiassaf/ngrid/commit/699b4aa))
* **core:** wrong behavior in autoSizeToFit ([eb17685](https://github.com/shlomiassaf/ngrid/commit/eb17685))


### Features

* **docs:** document column transform ([2fef015](https://github.com/shlomiassaf/ngrid/commit/2fef015)), closes [#46](https://github.com/shlomiassaf/ngrid/issues/46)



# 1.0.0-rc.9 (2019-09-11)


### Bug Fixes

* **ngrid:** vScrollAuto and vScrollFix are not working when used with binding ([d7c7a5a](https://github.com/shlomiassaf/ngrid/commit/d7c7a5a))


# 1.0.0-rc.8 (2019-09-05)


### Bug Fixes

* **ngrid:** proper property descriptors ([0f0aabb](https://github.com/shlomiassaf/ngrid/commit/0f0aabb))



# 1.0.0-rc.7 (2019-09-04)


### Bug Fixes

* **ngrid:** colum specific sorting is not working ([39428ad](https://github.com/shlomiassaf/ngrid/commit/39428ad)), closes [#45](https://github.com/shlomiassaf/ngrid/issues/45)



# 1.0.0-rc.6 (2019-09-01)


### Features

* **ngrid-material:** allow theme palette in selection ([0686edd](https://github.com/shlomiassaf/ngrid/commit/0686edd)), closes [#43](https://github.com/shlomiassaf/ngrid/issues/43)



# 1.0.0-rc.5 (2019-08-28)


### Bug Fixes

* **ngrid/drag:** fix row ordering issues ([2ec8dca](https://github.com/shlomiassaf/ngrid/commit/2ec8dca))

This fix allows proper move on scroll operations and in addition proper handling of row move when used in virtual scroll mode.
However, the UI placeholder in virtual scroll mode is not working properly due to lack of support in the cdk drag package.


# 1.0.0-rc.4 (2019-08-27)


### Bug Fixes

* **ngrid:** consider hz scroll on height calc in vScrollNone ([9d16a5a](https://github.com/shlomiassaf/ngrid/commit/9d16a5a))
* **ngrid:** handle height properly with vScrollNone ([fe83e5f](https://github.com/shlomiassaf/ngrid/commit/fe83e5f))



# 1.0.0-rc.3 (2019-08-26)


### Code Refactoring

* **ngrid:** deprecate `identityProp` in favor of `pIndex` ([a3edfbd](https://github.com/shlomiassaf/ngrid/commit/a3edfbd))


### Features

* **ngrid/clipboard:** add separator options ([b126951](https://github.com/shlomiassaf/ngrid/commit/b126951))


### BREAKING CHANGES

* **ngrid:** The `identityProp` input on the grid host (`pbl-ngrid`) is now deprecated in favor of the `pIndex` property on the column definitions.
For more information, read [this doc](https://shlomiassaf.github.io/ngrid/concepts/columns/identity)
`identityProp` will be removed in version 1.0.0



# 1.0.0-rc.2 (2019-08-26)


### Features

* **ngrid:** allow adding custom css classes for rows ([4600b40](https://github.com/shlomiassaf/ngrid/commit/4600b40)), closes [#40](https://github.com/shlomiassaf/ngrid/issues/40)



# 1.0.0-rc.1 (2019-08-19)


### Features

* **ngrid:** get data item from cell reference ([cf5506b](https://github.com/shlomiassaf/ngrid/commit/cf5506b))
* **ngrid/clipboard:** new plugin copy to clipboard ([1c52069](https://github.com/shlomiassaf/ngrid/commit/1c52069))



# 1.0.0-rc.0 (2019-08-18)


### Bug Fixes

* **docs:** wrong reference ([0ba846a](https://github.com/shlomiassaf/ngrid/commit/0ba846a))
* **ngrid:** competability with cdk 8.1.3 ([e1a9ec8](https://github.com/shlomiassaf/ngrid/commit/e1a9ec8)), closes [#37](https://github.com/shlomiassaf/ngrid/issues/37)


### Code Refactoring

* **ngrid:** bump angular to version 8.2.2 ([8f82092](https://github.com/shlomiassaf/ngrid/commit/8f82092))


### BREAKING CHANGES

**ngrid:**

- This bump included a bump in TS as well, to 3.5.3. TS 3.5.3 introduces a breaking change which was fixed in this release.

- Moving from `@angular/cli 8.0.3` introduces a breaking change. The package `@ngtools/webpack@8.0.4` is now adding `ctorParameters` property to all classes with ctor params, even the non-injectable ones which now will have a hard reference leading to a circular dependency error. This release includes a refactor of the code to fit this paradigm until someone in angular understands this and push a fix...



# 1.0.0-alpha.27 (2019-08-12)


### Bug Fixes

* **docs:** docs indicate using an invalid columns format ([9e7b30f](https://github.com/shlomiassaf/ngrid/commit/9e7b30f)), closes [#31](https://github.com/shlomiassaf/ngrid/issues/31)
* **docs:** handle entire link-item click ([73b1d36](https://github.com/shlomiassaf/ngrid/commit/73b1d36))


### Features

* **ngrid/detail-row:** control detail row updates ([672a590](https://github.com/shlomiassaf/ngrid/commit/672a590)), closes [#33](https://github.com/shlomiassaf/ngrid/issues/33)



# 1.0.0-alpha.26 (2019-06-27)


### Bug Fixes

* **ngrid-material/context-menu:** lower trigger z-index ([4e1fb92](https://github.com/shlomiassaf/ngrid/commit/4e1fb92))
* **ngrid/detail-row:** dont access extApi to get grid ([d9ea126](https://github.com/shlomiassaf/ngrid/commit/d9ea126))



# 1.0.0-alpha.25 (2019-06-27)


### Bug Fixes

* **ngrid:** can not invalidate column if split header group exist ([7db5a39](https://github.com/shlomiassaf/ngrid/commit/7db5a39))
* **ngrid:** fixed row container should show all content ([5dec91b](https://github.com/shlomiassaf/ngrid/commit/5dec91b))
* **ngrid:** fixed virtual scroll wrong offset on filter ([56ff95f](https://github.com/shlomiassaf/ngrid/commit/56ff95f)), closes [#11](https://github.com/shlomiassaf/ngrid/issues/11)
* **ngrid:** parent cell-syle update on initial load ([bfc2251](https://github.com/shlomiassaf/ngrid/commit/bfc2251))
* **ngrid/detail-row:** detail row template outside grid scope ([c6ca3e5](https://github.com/shlomiassaf/ngrid/commit/c6ca3e5)), closes [#1](https://github.com/shlomiassaf/ngrid/issues/1)


### Code Refactoring

* **ngrid:** remove multi box-model support ([6bf2544](https://github.com/shlomiassaf/ngrid/commit/6bf2544))


### Features

* **ngrid:** add new event - beforeInvalidateHeaders ([ecab8d1](https://github.com/shlomiassaf/ngrid/commit/ecab8d1))
* **ngrid:** allow ad-hoc generic header extensions via templates ([b224c95](https://github.com/shlomiassaf/ngrid/commit/b224c95))
* **ngrid-material/context-menu:** new plugin for context menus ([4826c72](https://github.com/shlomiassaf/ngrid/commit/4826c72))
* **ngrid/overlay-panel:** plugin that helps poping up overlay panels ([cedd949](https://github.com/shlomiassaf/ngrid/commit/cedd949))


### BREAKING CHANGES

* **ngrid:** `PblNgridComponent.boxSpaceModel` was used to set the box-model strategy of the cells, either margin or padding.
Padding was the deault, when switching to margin a lot of CSS overwrites were applied and different width logic was used for column calculations. This was the case at the very start but as more and more features were added it got very hard to maintain and only padding strategy was updated and margin was not working properly, especially when used with group headers. For this reason I've decided to deprecate it as it is probably not used by anyone and adds unwanted complaxity. If it will be requried in future versions we can apply it through a plugin.



# 1.0.0-alpha.24 "angular-eight" (2019-06-20)

### Code Refactoring

* upgrade to v8 (#24) ([3c8e451d](https://github.com/shlomiassaf/ngrid/commit/3c8e451d))
* **ngrid:** new design cell style control ([b1a3e4b](https://github.com/shlomiassaf/ngrid/commit/b1a3e4b))

### BREAKING CHANGES

* This release is not backward compatible with angular v7 due to breaking changes in the angular compiler in v8
* **ngrid:** Beacuse angular 8 has a new implementation for `ngStyle` and `ngClass` a new directive is needed which replaces `parentNgStyle` and `parentNgClass` that are not longer used, use `ngridCellClass` and `ngridCellStyle` instead.



# 1.0.0-alpha.23 (2019-06-16)

### Code Refactoring

* **ngrid**: enhance sorting and filtering APIs (#19) ([9961314](https://github.com/shlomiassaf/ngrid/commit/9961314))



# 1.0.0-alpha.22 (2019-06-13)

### Code Refactoring

* **ngrid/state**: workaround tree shakable expression in ngrid/state ([abae5a5](https://github.com/shlomiassaf/ngrid/commit/abae5a5))



# 1.0.0-alpha.21 (2019-06-13)

### Code Refactoring

* **ngrid**: workaround tree shakable expression in extending plugins ([c602bd9](https://github.com/shlomiassaf/ngrid/commit/c602bd9))
* **ngrid/drag**: workaround inheritance limit to a depth of 1 ([e2d9960](https://github.com/shlomiassaf/ngrid/commit/e2d9960))



# 1.0.0-alpha.20 (2019-06-12)

### Features

* **ngrid**: new default-dark and default-light themes bundled ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))
* **ngrid-material**: new themes bundled matching the material bundled themes ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))

### Code Refactoring

* **ngrid-material**: removed SCSS theming helpers ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))
* **ngrid**: bundle SCSS theme into a single file ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))

### BREAKING CHANGES

* The ngrid-material package does not have SCSS theming helper any more.
All SCSS theme files are now located in the core package (@pebula/ngrid)

