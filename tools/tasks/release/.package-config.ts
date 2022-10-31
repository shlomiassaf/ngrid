import { join } from 'path';
import { readFileSync } from 'fs';

const cache = new Map<string,  { packageJsonPath: string, packageJson: any, packageConfig: PackageConfig }>();

export interface PackageConfig {
  defaultCommitProejct: string;
  releasePackages: string[];
  angularPackageVersion: string;
}

export function GetProjectConfig(projectDir: string)
{
  if (!cache.has(projectDir))
  {
    const packageJsonPath = join(projectDir, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const packageConfig = packageJson.packageConfig as PackageConfig;
    cache.set(projectDir, { packageJsonPath, packageJson, packageConfig });
  }
  return cache.get(projectDir)!;
}