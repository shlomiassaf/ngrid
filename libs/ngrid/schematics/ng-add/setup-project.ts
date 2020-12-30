import {chain, Rule} from '@angular-devkit/schematics';

import { SetupSchema } from './schema';
import { addThemeToAppStyles } from './theming/theming';

export default function ngAddSetupProject(options: SetupSchema): Rule {

  return chain([
    ...(options.withRules.map( factory => factory() )),
    addThemeToAppStyles(options),
  ]);
}
