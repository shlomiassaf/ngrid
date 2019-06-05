import { PblNgridIdentResolver, PblNgridIdentResolverContext } from '../state-model';

export class PblNgridIdAttributeIdentResolver implements PblNgridIdentResolver {
  resolveId(ctx: PblNgridIdentResolverContext): string | undefined {
    return ctx.grid.id;
  }
}
