
import { m, MdTypeMap } from '../../mdast';
import { ApiItemKind, ApiFunction } from '@microsoft/api-extractor';

import { ApiItemTransformer, BaseApiItemTransformer } from '../base';

@ApiItemTransformer({
  kind: ApiItemKind.Function,
  create: (apiItem: ApiFunction) => new ApiFunctionTransformer(apiItem, 'root', true),
})
export class ApiFunctionTransformer extends BaseApiItemTransformer<'root', ApiFunction> {

  mdast(): MdTypeMap['root'] {
    return m('root', { }, [
      m('heading', { depth: 2 }, [
        m('text', { value: this.apiItem.displayName }),
      ]),
      m('code', { value: this.apiItem.getExcerptWithModifiers(), lang: 'ts' })
    ])
  }

}

