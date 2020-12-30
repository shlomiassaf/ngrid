import { chain, Rule, externalSchematic } from '@angular-devkit/schematics';

import { SetupSchema } from './setup-schema';
import { addThemeToAppStyles } from './theming/theming';

export default function ngAddSetupProject(options: SetupSchema): Rule {

  const { project } = options;
  return chain([
    ...options.externalSchematics.map( p => {
      switch (p) {
        case '@angular/cdk':
          return externalSchematic('@angular/cdk', 'ng-add', { name: project })
        case '@ng-bootstrap/ng-bootstrap':
          return externalSchematic('@ng-bootstrap/ng-bootstrap', 'ng-add', { project })
        case '@angular/material':
          return externalSchematic('@angular/material', 'ng-add', { name: project })
        default:
          throw new Error(`Invalid external schematic ${p}`);
      }
    }),
    addThemeToAppStyles(options),
  ]);
}
