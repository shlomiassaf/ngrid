# 1.0.0-alpha.24 (2019-06-20)

This release supports Angular V8. (not backward compatible with v7)

### Code Refactoring

* **ngrid:** new design cell style control ([b1a3e4b](https://github.com/shlomiassaf/ngrid/commit/b1a3e4b))


### BREAKING CHANGES

* **ngrid:** Beacuse angular 8 has a new implementation for `ngStyle` and `ngClass` a new directive is needed which replaces `parentNgStyle` and `parentNgClass` that are not longer used, use `ngridCellClass` and `ngridCellStyle` instead.



# 1.0.0-alpha.20 (2019-06-12)

### feat

* **ngrid**: new default-dark and default-light themes bundled ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))
* **ngrid-material**: new themes bundled matching the material bundled themes ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))

### refactor

* **ngrid-material**: removed SCSS theming helpers ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))
* **ngrid**: bundle SCSS theme into a single file ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))

### chore

* update build process ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))
* support bundling of sass (theming) ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))
* support compilation of sass (theming) ([cc0e10c](https://github.com/shlomiassaf/ngrid/commit/cc0e10c))

### BREAKING CHANGES

* The ngrid-material package does not have SCSS theming helper any more.
All SCSS theme files are now located in the core package (@pebula/ngrid)

