import '../../typedoc-patchs/src/patching';
import { Application } from "typedoc";
import { PluginHost } from "typedoc/dist/lib/utils";

import { LibraryModePlugin as LM } from './library-mode';

function Plugin(pluginHost: PluginHost) {
  const app: Application = pluginHost.owner;

  if (!app.converter.hasComponent('library-mode-plugin')) {
    app.converter.addComponent('library-mode-plugin', LM as any);
  }
}

module Plugin {
  export const LibraryModePlugin: typeof LM = LM;
  export type LibraryModePlugin = LM;

}

export default Plugin;
