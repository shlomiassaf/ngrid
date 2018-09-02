import '../../typedoc-patchs/src/patching';

/**
 * This plugin will restructure the whole project so all reflections are stored in one global map.
 * The nested structure will remain but children will now contain references to reflections (number)
 * and not the reflections themselves.
 */
import { Application } from "typedoc";
import { PluginHost } from "typedoc/dist/lib/utils";

import { onComponentAdded } from '../../utils';
import * as browser from './browser';

function Plugin(pluginHost: PluginHost) {
  const app: Application = pluginHost.owner;

  onComponentAdded(app, 'serializer', c => {
    require('./serialization/index').verifyRegistration(app.serializer);
  });
}

module Plugin {
  export type DataSourceTable<T> = browser.DataSourceTable<T>;
  export type DSReflectionContainer = browser.DSReflectionContainer;
  export type DSSourceReferenceObject = browser.DSSourceReferenceObject;
  export type DSReflectionObject = browser.DSReflectionObject;
  export type DSParameterReflectionObject = browser.DSParameterReflectionObject;
  export type DSContainerReflectionObject = browser.DSContainerReflectionObject;
  export type DSDeclarationReflectionObject = browser.DSDeclarationReflectionObject;
  export type DSSignatureReflectionObject = browser.DSSignatureReflectionObject;
  export type DSProjectReflectionObject = browser.DSProjectReflectionObject;
  export type ProjectDataSource = browser.ProjectDataSource;

}

export = Plugin;
