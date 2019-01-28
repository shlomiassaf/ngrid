
import { m, MdTypeMap } from '../../mdast';
import { ApiItemKind, ApiPackage, ApiItem } from '@microsoft/api-extractor';

import { ApiItemTransformer, BaseApiItemTransformer } from '../base';

@ApiItemTransformer({
  kind: ApiItemKind.Package,
  create: (apiItem: ApiPackage) => new ApiPackageTransformer(apiItem, 'root', true),
})
export class ApiPackageTransformer extends BaseApiItemTransformer<'root', ApiPackage> {
  mdast(): MdTypeMap['root'] {
    const apiMembers: ReadonlyArray<ApiItem> = this.apiItem.entryPoints[0].members;
    const sections = {} as any;

    for (const apiMember of apiMembers) {
      try {
        this.context.add(apiMember);
      } catch (err) {
        console.warn(err.message);
        continue;
      }

      const arr = sections[apiMember.kind] || (sections[apiMember.kind] = [ m('heading', { depth: 2 }, [ m('text', { value: apiMember.kind }) ]) ]);
      const url = this.context.find(apiMember).relativeUrl();

      arr.push(m('link', { url, title: apiMember.displayName }, [
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

