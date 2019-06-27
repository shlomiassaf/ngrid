import { Application } from 'typedoc';

import jsonDataSource from './plugins/json-datasource/src/index';
import libraryMode from './plugins/library-mode/src/index';

export class DocsiTypedocApplication extends Application {
  private inputFiles: string[];

  protected bootstrap(options?: any) {
    const result = super.bootstrap(options);
    libraryMode(this.plugins);
    jsonDataSource(this.plugins);
    this.inputFiles = result.inputFiles;
    return result;
  }

  generateJsonObject(inputFiles?: string[]): jsonDataSource.DSProjectReflectionObject {
    const project = this.convert(inputFiles || this.inputFiles);
    return this.serializer.projectToObject(project);
  }
}
