import { AssetPattern } from '@angular-devkit/build-angular';

export interface GhPagesExecutorSchema {
    baseHref: string;
    buildTarget: string;
    serverTarget: string;
    ssrWebpackConfig: string;
    ssrProccessingScript: string;
    assets?: AssetPattern[];
    runLocalServer: booolean;
} // eslint-disable-line
