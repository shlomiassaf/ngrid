const toposort = require('toposort');

import * as Path from 'path';
import * as FS from 'fs';
import * as ts from 'typedoc/node_modules/typescript';

import { Reflection, ContainerReflection, DeclarationReflection } from 'typedoc';


export class MonoRepo {

  get packages(): Array<MonoRepoPackage> {
    return Array.from(this.roots.values());
  }

  private rootsArray: string[] = [];
  private roots = new Map<string, MonoRepoPackage>();

  findRootByChild(path: string): string | undefined {
    return this.rootsArray.find( root => path.startsWith(root) );
  }

  addRoot(root: string): void {
    if (!this.roots.has(root)) {
      this.roots.set(root, new MonoRepoPackage(root));
      this.rootsArray.push(root);
    }
  }

  hasRoot(root: string): boolean {
    return this.roots.has(root);
  }

  bindReflection(node: ts.SourceFile, reflection: Reflection): MonoRepoPackage {
    const path = Path.resolve(node.fileName);
    const root = this.locateRoot(path);

    if (!root) {
      throw new Error('Invalid mono-repo structure, could not find package.json for ' + node.fileName);
    }

    this.addRoot(root);

    /* we can't findRootByChild before locating because internal packages will fail (e.g angular/core/testing) */
    // let root = this.findRootByChild(path);
    // if (!root) {
    //   root = this.locateRoot(path);
    //   if (root) {
    //     this.addRoot(root);
    //   }
    // }

    const pkg = this.roots.get(root);
    pkg.modules.push(reflection);
    return pkg;
  }

  private locateRoot(path: string): string {
    let dirName: string, parentDir = Path.dirname(path);
    do {
      dirName = parentDir;

      if ( FS.existsSync(Path.join(dirName, 'package.json')) ) {
        return dirName;
      }

      parentDir = Path.dirname(dirName);
    } while (dirName !== parentDir);
  }
}

export class MonoRepoPackage {
  rootModule: DeclarationReflection;
  modules: Reflection[] = [];

  depGraph: { [key: string]: string[] } = {};

  /**
   * Return the internal reflections within the modules, without the containing modules and
   * without the root module.
   * @return {Reflection[]}
   */
  get reflections(): Reflection[] {
    const coll: Reflection[] = [];
    this.modules
      .forEach( module => coll.push( ...((<ContainerReflection>module).children || [])) );
    return coll;
  }

  constructor(public rootDir: string) { }
}
