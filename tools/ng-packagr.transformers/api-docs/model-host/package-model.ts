import { PackageName } from '@microsoft/node-core-library';
import { ApiPackage } from '@microsoft/api-extractor';

import { BaseModelHost } from './base-host';
import { PackageModel } from '../models';

export class PackageModelHost extends BaseModelHost<PackageModel> {
  scope: string;
  name: string;
  displayName: string;
  path: string[];

  constructor(pkg: ApiPackage) {
    super();
    const parsed = PackageName.parse(this.displayName = pkg.displayName);
    this.scope = parsed.scope ? parsed.scope.substr(1) : '';
    this.name = parsed.unscopedName;
    this.path = pkg.name.split('/');
  }

  toJson(): PackageModel {
    return {
      scope: this.scope,
      name: this.name,
      displayName: this.displayName,
      metaLink: (this.scope ? `${this.scope}/` : '') + `${this.name}/index.json`,
    };
  }
}
