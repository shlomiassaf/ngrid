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
import { ApiItemTransformer } from './transformers';


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
      const ctx = ApiItemTransformer.create(pkg);
      const mdast = ctx.getTransformer(pkg).mdast();

      const unified = require('unified');
      const html = require('remark-html');

      const raw = unified().use(html).stringify(mdast);
      console.log(raw);
    }
  }
}


const apiDoc = ApiDocs.fromSerializedPackages('/Users/shlomiassaf/Desktop/Code/shlomi/__LIB__/neg/dist/@neg/utils/api-extractor.json');
apiDoc.build();
