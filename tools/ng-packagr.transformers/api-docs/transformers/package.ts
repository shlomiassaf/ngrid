
import { m, MdTypeMap } from '../mdast';
import { ApiItemKind, ApiPackage, ApiItem } from '@microsoft/api-extractor';

import { ApiItemTransformer } from './base';

export class ApiPackageTransformer extends ApiItemTransformer<'root', ApiPackage> {
  static factory = {
    kind: ApiItemKind.Package,
    create: (apiItem: ApiPackage) => new ApiPackageTransformer(apiItem, 'root', true),
  };

  mdast(): MdTypeMap['root'] {
    const apiMembers: ReadonlyArray<ApiItem> = this.apiItem.entryPoints[0].members;
    const sections = {} as any;

    for (const apiMember of apiMembers) {
      const transformer = this.context.getTransformer(apiMember);
      const arr = sections[apiMember.kind] || (sections[apiMember.kind] = [ m('heading', { depth: 2 }, [ m('text', { value: apiMember.kind }) ]) ]);

      arr.push(m('link', { url: 'get-link-from-transformer', title: apiMember.displayName }, [
        m('text', { value: apiMember.displayName } ),
      ]));
    }

    return m('root', { }, [
      m('heading', { depth: 1 }, [
        m('text', { value: this.apiItem.displayName })
      ]),
      m('thematicBreak', {}),
      ...Object.keys(sections).reduce( (coll, curr) => coll.concat(sections[curr]), [] )
    ])
  }
}

