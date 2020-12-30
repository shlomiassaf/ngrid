export interface Schema {
  /**
   * Name of the project where ng-bootstrap library should be installed
   */
  project?: string;

  uiPlugin?: 'none' | 'material' | 'bootstrap';

  theme?: 'light' | 'dark' | 'custom';

}
