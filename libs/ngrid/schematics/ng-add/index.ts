import { Rule, SchematicContext, SchematicsException, Tree, externalSchematic } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';

import * as meta from './metadata';
import { Schema, SetupSchema } from './schema';
import * as messages from './messages';
import { addPackageToPackageJson, getPackageVersionFromPackageJson } from '../utils/package-config';

function getNgridPackageName(packageName: string) {
  return `@pebula/${packageName}`;
}

export default function ngAdd(options: Schema): Rule {
  return async(tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const project = options.project || workspace.extensions.defaultProject as string;
    const uiPlugin = options.uiPlugin || 'none';
    const theme = options.theme || 'light';

    const projectWorkspace = workspace.projects.get(project);

    if (!projectWorkspace) {
      throw new SchematicsException(messages.noProject(project));
    }

    const setupSchema: SetupSchema = {
      options: { project, uiPlugin, theme },
      withRules: [],
      workspace: workspace as any,
      project: projectWorkspace as any,
    };

    // Installing dependencies
    const angularCdkVersion = getPackageVersionFromPackageJson(tree, '@angular/cdk');

    if (angularCdkVersion === null) {
      addPackageToPackageJson(tree, '@angular/cdk', meta.NG_MATERIAL_VERSION);
      setupSchema.withRules.push(() => externalSchematic('@angular/cdk', 'ng-add', project ? { name: project } : {}));
    }

    addPackageToPackageJson(tree, getNgridPackageName('ngrid'), `^${meta.NGRID_VERSION}`);

    switch (uiPlugin) {
      case 'bootstrap':
        const ngBootstrapVersion = getPackageVersionFromPackageJson(tree, '@ng-bootstrap/ng-bootstrap');
        if (ngBootstrapVersion === null) {
          addPackageToPackageJson(tree, '@ng-bootstrap/ng-bootstrap', meta.NG_BOOTSTRAP_VERSION);
          setupSchema.withRules.push(() => externalSchematic('@ng-bootstrap/ng-bootstrap', 'ng-add', project ? { project } : {}));
        }
        addPackageToPackageJson(tree, getNgridPackageName('ngrid-bootstrap'), `^${meta.NGRID_VERSION}`);
        break;
      case 'material':
        const ngMaterialVersion = getPackageVersionFromPackageJson(tree, '@angular/material');
        if (ngMaterialVersion === null) {
          addPackageToPackageJson(tree, '@angular/material', meta.NG_MATERIAL_VERSION);
          setupSchema.withRules.push(() => externalSchematic('@angular/material', 'ng-add', project ? { name: project } : {}));
        }
        addPackageToPackageJson(tree, getNgridPackageName('ngrid-material'), `^${meta.NGRID_VERSION}`);
        break;
    }

    const installTaskId = context.addTask(new NodePackageInstallTask());

    if (projectWorkspace.extensions.projectType === ProjectType.Application) {
      context.addTask(new RunSchematicTask('ng-add-setup-project', setupSchema), [ installTaskId ]);
    }
  };
}
