import { Component, ConverterComponent } from "typedoc/dist/lib/converter/components";
import { Converter } from "typedoc/dist/lib/converter/converter";

import { Option } from "typedoc/dist/lib/utils";
import { ParameterType } from "typedoc/dist/lib/utils/options/declaration";

import { StandaloneModeLibraryPlugin, MonoRepoLibraryPlugin } from './modes';
import * as optionsHelpText from './options-help-text';

@Component({name:'library-mode-plugin'})
export class LibraryModePlugin extends ConverterComponent {

  @Option({
    name: 'libraryType',
    short: `The structure of the library.`,
    help: optionsHelpText.libraryType,
    type: ParameterType.String,
    defaultValue: 'standalone'
  })
  libraryType: 'standalone' | 'monorepo';

  @Option({
    name: 'standaloneMode',
    short: `The standalone structure to use.`,
    help: optionsHelpText.standaloneMode,
    type: ParameterType.Mixed,
    defaultValue: false
  })
  standaloneMode: string | false;

  @Option({
    name: 'enforcePublicApi',
    short: `Public API mode`,
    help: optionsHelpText.enforcePublicApi,
    type: ParameterType.Mixed,
    defaultValue: false
  })
  enforcePublicApi: string | string[] | boolean;

  initialize() {
    this.listenTo(this.owner, {
      [Converter.EVENT_BEGIN]:                this.onBegin
    });
  }

  protected onBegin(): void {
    const enforcePublicApi: string[] | boolean = typeof this.enforcePublicApi === 'string'
      ? <any> [this.enforcePublicApi]
      : <any> this.enforcePublicApi
    ;

    switch (this.libraryType) {
      case 'monorepo':
        new MonoRepoLibraryPlugin(this.owner, enforcePublicApi);
        break;
      default:
        new StandaloneModeLibraryPlugin(this.owner, enforcePublicApi, this.standaloneMode);
        break;
    }
  }

}
