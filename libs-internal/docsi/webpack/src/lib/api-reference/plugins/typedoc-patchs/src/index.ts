import './patching';
import { Application } from "typedoc";
import { PluginHost } from "typedoc/dist/lib/utils";


let activated = false;
function Plugin(pluginHost: PluginHost) {
  if (!activated) {
    activated = true;
    const app: Application = pluginHost.owner;
  }
}

export = Plugin;
