import { ApiItemTransformer } from './base';
import { ApiPackageTransformer } from './package';

export { ApiItemTransformer } from './base';

[
  ApiPackageTransformer,

].forEach( cls => ApiItemTransformer.register(cls.factory.kind, cls.factory.create) );
