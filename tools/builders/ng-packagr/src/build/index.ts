// TODO: @angular-devkit/core/node_modules/rxjs uses different rxjs with breaking changes, replace when they align.
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
import { Observable } from '@angular-devkit/core/node_modules/rxjs';
import { tap } from '@angular-devkit/core/node_modules/rxjs/operators';

import { BuildEvent, BuilderConfiguration } from '@angular-devkit/architect';
import * as ngPackagr from 'ng-packagr';
import { NgPackagrBuilder as _NgPackagrBuilder, NgPackagrBuilderOptions } from '@angular-devkit/build-ng-packagr';

import { CUSTOM_COMPILE_NGC_TRANSFORM } from './update-paths-mapping-for-built-packages';

// Instead of re-writing NgPackagrBuilder in full, just for adding some providers, we will patch
// the NgPackager instead... ohh my!
export class NgPackagrBuilder extends _NgPackagrBuilder {
  run(builderConfig: BuilderConfiguration<NgPackagrBuilderOptions>): Observable<BuildEvent> {
    const { build, watch } = ngPackagr.NgPackagr.prototype;
    ngPackagr.NgPackagr.prototype.build = function (this: ngPackagr.NgPackagr) {
      this.withProviders([CUSTOM_COMPILE_NGC_TRANSFORM]);
      return build.call(this);
    }
    ngPackagr.NgPackagr.prototype.watch = function (this: ngPackagr.NgPackagr) {
      this.withProviders([CUSTOM_COMPILE_NGC_TRANSFORM]);
      return watch.call(this);
    }
    return super.run(builderConfig).pipe(
      tap( buildEvent => {
        ngPackagr.NgPackagr.prototype.build = build;
        ngPackagr.NgPackagr.prototype.watch = watch;
      })
    )
  }
}

export default NgPackagrBuilder;
