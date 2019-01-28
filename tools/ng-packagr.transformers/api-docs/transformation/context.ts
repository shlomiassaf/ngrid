import { ApiItem, ApiItemKind, ApiPackage } from '@microsoft/api-extractor';
import { BaseApiItemTransformer } from './base';

export interface TransformerFactoryStore {
  find(kind: ApiItemKind): (apiItem: ApiItem) => BaseApiItemTransformer<any>;
}

export class ApiTransformationContext {
  private pages = new Map<BaseApiItemTransformer<any>, any>();
  private transformerInstanceStore = new Map<ApiItem, BaseApiItemTransformer<any>>();

  private onAdd: (transformer: BaseApiItemTransformer<any>) => void;

  constructor(private transformerFactory: TransformerFactoryStore) { }

  build(pkg: ApiPackage): Array<[BaseApiItemTransformer<any>, any]> {
    if (!this.onAdd) {
      this.onAdd = t => {
        if (t.isPage) {
          this.pages.set(t, t.mdast());
        }
      };
      this.add(pkg);
      this.onAdd = undefined;
    }
    const entries = Array.from(this.pages.entries());
    this.pages.clear();
    return entries;
  }

  find(item: ApiItem): BaseApiItemTransformer<any> | undefined {
    return this.transformerInstanceStore.get(item);
  }

  /**
   * Add an item to the build.
   * Throws when a factory for this item does not exist.
   *
   * @returns True when the item was added, False when it is already exists.
   */
  add(item: ApiItem): boolean {
    if (!this.transformerInstanceStore.has(item)) {
      const transformerFactory = this.transformerFactory.find(item.kind);
      if (transformerFactory) {
        const transformer = transformerFactory(item);
        this.transformerInstanceStore.set(item, transformer);
        if (this.onAdd) {
          this.onAdd(transformer);
        }
        return true;
      } else {
        throw new Error(`A transformation factory does not exists for ${item.kind}`);
      }
    }
    return false;
  }
}
