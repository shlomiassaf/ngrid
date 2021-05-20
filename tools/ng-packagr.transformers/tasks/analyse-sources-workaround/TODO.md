This task is a temporary workaround to the inclusive child package detection introduced in `ng-packagr@12`.

The task mimics the behavior of the [original analyse sources transform](https://github.com/ng-packagr/ng-packagr/blob/c2efc42591ea8f2581cb7c8d3ea16a6b9cfa526e/src/lib/ng-package/entry-point/analyse-sources.transform.ts) behavior in `ng-packagr`

There's an [issue](https://github.com/ng-packagr/ng-packagr/issues/1982) reported in the `ng-packagr` github repository.

If fixed, we can remove this workaround, otherwise process based on the action taken in the issue.

Removal steps:

- Remove task and TS references in the code
- Remove references in `angular.json` (search for `analyseSourcesWorkaround`)
