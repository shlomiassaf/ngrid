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

