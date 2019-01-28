import {
  DocSection,
  DocPlainText,
  DocLinkTag,
  TSDocConfiguration,
  StringBuilder,
  DocNodeKind,
  DocParagraph,
  DocCodeSpan,
  DocFencedCode,
  StandardTags,
  DocBlock,
  DocComment
} from '@microsoft/tsdoc';
import {
  ApiModel,
  ApiItem,
  ApiEnum,
  ApiPackage,
  ApiItemKind,
  ApiReleaseTagMixin,
  ApiDocumentedItem,
  ApiClass,
  ReleaseTag,
  ApiStaticMixin,
  ApiPropertyItem,
  ApiInterface,
  Excerpt,
  ApiParameterListMixin,
  ApiReturnTypeMixin,
  ApiDeclaredItem,
  ApiNamespace
} from '@microsoft/api-extractor';

import { PackageModelHost } from './model-host';
import { createContext } from './transformation';


export class ApiDocs {

  static fromSerializedPackages(...jsonPaths: string[]): ApiDocs {
    const apiModel = new ApiModel();
    for (const j of jsonPaths) {
      apiModel.loadPackage(j);
    }
    return new ApiDocs(apiModel);
  }

  constructor(public readonly apiModel: ApiModel) { }

  build() {
    for (const pkg of this.apiModel.packages) {
      const ctx = createContext(pkg);
      const result = ctx.build(pkg);

      for (const [t, mdast] of result) {
        const unified = require('unified');
        const remarkHighlightJs = require('remark-highlight.js');
        const html = require('remark-html');

        const revised = unified().use(remarkHighlightJs).use(html).runSync(mdast);
        const raw = unified().use(html).stringify(revised);
        console.log('\nPAGE: ', t.apiItem.displayName, ' - ', t.apiItem.canonicalReference, ' - ', t.filename(), ' - ', t.apiItem.getScopedNameWithinPackage());
        console.log(`<html><body>${raw}</body></html>`);
      }
    }
  }
}


const apiDoc = ApiDocs.fromSerializedPackages('/Users/shlomiassaf/Desktop/Code/shlomi/__LIB__/neg/dist/@neg/utils/api-extractor.json');
apiDoc.build();
