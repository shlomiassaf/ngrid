import { workspaces } from '@angular-devkit/core';
import { Rule } from '@angular-devkit/schematics';

export interface Schema {
  /**
   * Name of the project where ng-bootstrap library should be installed
   */
  project?: string;

  uiPlugin?: 'none' | 'material' | 'bootstrap';

  theme?: 'light' | 'dark' | 'custom';

}

export interface SetupSchema {
  options: Required<Schema>;
  withRules: Array<() => Rule>;
  workspace: workspaces.WorkspaceDefinition;
  project: workspaces.ProjectDefinition;
}
