import * as Path from 'path';
import { NgEntryPoint } from 'ng-packagr/lib/ng-package/entry-point/entry-point';

// TODO: This will map the entry file to it's emitted output path taking rootDir into account.
// It might not be fully accurate, consider using the compiler host to create a direct map.
export function getDistEntryFile(entryPoint: NgEntryPoint, rootDir: string) {
  return Path.join(entryPoint.destinationPath, Path.relative(rootDir, entryPoint.entryFilePath)).replace(/\.ts$/, '.js');
}

