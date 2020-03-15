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

