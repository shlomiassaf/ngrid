import { PackageName } from '@microsoft/node-core-library';
import { DocComment } from '@microsoft/tsdoc';
import { MdTypeMap } from '../mdast';
import { ApiPackage, ApiDocumentedItem, ApiDeclaredItem, ApiItem, ApiItemKind, ApiReleaseTagMixin, ReleaseTag, ApiParameterListMixin } from '@microsoft/api-extractor';

import { ApiTransformationContext } from './context';

const TRANSFORMERS = new Map<ApiItemKind, (apiItem: ApiItem) => BaseApiItemTransformer<any, any>>();
const PACKAGE_CONTEXT_MAP = new WeakMap<ApiPackage, ApiTransformationContext>();

export function ApiItemTransformer(meta: { kind: ApiItemKind; create: (apiItem: ApiItem) => BaseApiItemTransformer<any> }) {
  return target => {
    TRANSFORMERS.set(meta.kind, meta.create);
  }
}

export function createContext(item: ApiPackage): ApiTransformationContext {
  const store = {
    find: (kind: ApiItemKind) => TRANSFORMERS.get(kind),
  };
  const ctx = new ApiTransformationContext(store);
  PACKAGE_CONTEXT_MAP.set(item.getAssociatedPackage(), ctx);
  return ctx;
}

export abstract class BaseApiItemTransformer<TMdAstType extends keyof MdTypeMap, TApiItem extends ApiItem = ApiItem> {

  get context(): ApiTransformationContext {
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

  filename(suffix = '.md'): string {
    let baseName = '';
    for (const hierarchyItem of this.apiItem.getHierarchy()) {
      // For overloaded methods, add a suffix such as "MyClass.myMethod_2".
      let qualifiedName: string = hierarchyItem.displayName;
      if (ApiParameterListMixin.isBaseClassOf(hierarchyItem)) {
        if (hierarchyItem.overloadIndex > 0) {
          qualifiedName += `_${hierarchyItem.overloadIndex}`;
        }
      }

      switch (hierarchyItem.kind) {
        case ApiItemKind.Model:
        case ApiItemKind.EntryPoint:
          break;
        case ApiItemKind.Package:
          baseName = PackageName.getUnscopedName(hierarchyItem.displayName);
          break;
        default:
          baseName += '.' + qualifiedName;
      }
    }
    return baseName.toLowerCase() + suffix;
  }

  relativeUrl(suffix = '.md'): string {
    return './' + this.filename(suffix);
  }
}
