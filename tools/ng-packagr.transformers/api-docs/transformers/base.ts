import { DocComment } from '@microsoft/tsdoc';
import { MdTypeMap } from '../mdast';
import { ApiPackage, ApiDocumentedItem, ApiDeclaredItem, ApiItem, ApiItemKind, ApiReleaseTagMixin, ReleaseTag } from '@microsoft/api-extractor';

const TRANSFORMERS = new Map<ApiItemKind, (apiItem: ApiItem) => ApiItemTransformer<any, any>>();
const PACKAGE_CONTEXT_MAP = new WeakMap<ApiPackage, ApiCodeGenContext>();

export class ApiCodeGenContext {
  private tStore = new Map<ApiItem, ApiItemTransformer<any>>();

  getTransformer(item: ApiItem): ApiItemTransformer<any> {
    let transformer = this.tStore.get(item);

    if (!transformer) {
      transformer = TRANSFORMERS.get(item.kind)(item);
      this.tStore.set(item, transformer);
      if (transformer.isPage) {
        this.addPage(transformer);
      }
    }

    return transformer;
  }

  addPage(item: ApiItemTransformer<any>): void {

  }
}

export abstract class ApiItemTransformer<TMdAstType extends keyof MdTypeMap, TApiItem extends ApiItem = ApiItem> {

  static register(kind: ApiItemKind, transformerFactory: (apiItem: ApiItem) => ApiItemTransformer<any, any>): void {
    TRANSFORMERS.set(kind, transformerFactory);
  }

  static create(item: ApiPackage): ApiCodeGenContext {
    const ctx = new ApiCodeGenContext();
    PACKAGE_CONTEXT_MAP.set(item, ctx);
    const factory = TRANSFORMERS.get(item.kind);
    factory(item);
    return ctx;
  }

  get context(): ApiCodeGenContext {
    return PACKAGE_CONTEXT_MAP.get(this.apiItem.getAssociatedPackage());
  }

  get tsdocComment(): DocComment | undefined { return (<unknown>this.apiItem as ApiDocumentedItem).tsdocComment; }

  get isDeclaration(): boolean { return this.apiItem instanceof ApiDeclaredItem; }

  get isDocumented(): boolean { return this.apiItem instanceof ApiDocumentedItem; }

  get isBeta(): boolean { return ApiReleaseTagMixin.isBaseClassOf(this.apiItem) && this.apiItem.releaseTag === ReleaseTag.Beta; }

  constructor(public readonly apiItem: TApiItem,
              public readonly mdType: TMdAstType,
              public readonly isPage: boolean) { }

  abstract mdast(): MdTypeMap[TMdAstType];

}
