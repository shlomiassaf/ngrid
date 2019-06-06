import { PblNgridIdentResolver, PblNgridIdentResolverContext } from '../models/index';

export class PblNgridIdAttributeIdentResolver implements PblNgridIdentResolver {
  resolveId(ctx: PblNgridIdentResolverContext): string | undefined {
    return ctx.grid.id;
  }
}
