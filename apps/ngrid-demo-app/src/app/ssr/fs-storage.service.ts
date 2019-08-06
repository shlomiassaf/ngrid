// WORKAROUND FOR https://github.com/ng-seed/universal/issues/631
import { Injectable } from '@angular/core';
import { Storage } from '@ngx-cache/core';
import { EventEmitter } from 'events';
import { mkdirSync, readdirSync, readFileSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

import {FsStorageLoader} from "@ngx-cache/fs-storage";

export class FsItemMetadata {
  size: number;

  constructor(private readonly key: string,
              private readonly index: number) {
  }
}

export class FsEvent {
  constructor(private readonly key: string,
              private readonly oldValue: any,
              private readonly newValue: any,
              private readonly pid: string,
              private readonly area: string = 'fs-storage') {
  }
}

@Injectable()
export class FsStorageService extends Storage {
  length: number;
  keys: Array<string>;

  private readonly instances = {};

  private readonly path: string;
  private readonly quota: number;
  private readonly pid: string;

  private metadata: Map<string, FsItemMetadata>;
  private bytesUsed: number;

  constructor(readonly loader: FsStorageLoader) {
    super();

    this.path = resolve(this.loader.path);
    this.quota = this.loader.quota;

    if (this.instances[this.path]) {
      return this.instances[this.path];
    }

    this.length = 0;
    this.keys = [];
    this.pid = `pid:${process.pid}`;
    this.metadata = new Map<string, FsItemMetadata>();
    this.bytesUsed = 0;

    try {
      let stat = statSync(this.path);

      if (!stat.isDirectory()) {
        throw new Error(`A file exists at the location ${this.path} when trying to create/open localStorage`);
      }

      this.length = 0;
      this.keys = readdirSync(this.path);
      this.bytesUsed = 0;

      const decodedKeys: Array<string> = [];

      this.keys.forEach((key: string, index: number) => {
        const decodedKey = decodeURIComponent(key);
        decodedKeys.push(decodedKey);

        const item = new FsItemMetadata(key, index);
        this.metadata[decodedKey] = item;

        stat = this.getStats(key);

        if (!stat.hasOwnProperty('size')) {
          item.size = stat.size;
          this.metadata[decodedKey] = item;
          this.bytesUsed += stat.size;
        }
      });

      this.keys = decodedKeys;
      this.length = this.keys.length;
    } catch (error) {
      console.error("error while initializing service", error)
      mkdirSync(this.path);
    }

    this.instances[this.path] = this;
  }

  setItem(key: string, value: any): boolean {
    const hasListeners = EventEmitter.listenerCount(this, 'fs-storage');
    const oldValue = hasListeners ? this.getItem(key) : undefined;

    let item = this.metadata[key];
    const oldLength = item ? item.size : 0;

    if (this.bytesUsed - oldLength + Number(value.toString().length) > this.quota) {
      throw new Error(`Disk quota (${this.quota / 1024}KB) has been reached!`);
    }

    const encodedKey = encodeURIComponent(key);
    const filename = join(this.path, encodedKey);

    writeFileSync(filename, value.toString(), 'utf8');

    if (!item) {
      item = new FsItemMetadata(encodedKey, this.keys.push(key) - 1);
      item.size = value.toString().length;

      this.length += 1;
      this.metadata[key] = item;
      this.bytesUsed += value.toString().length;
    }

    if (!hasListeners) {
      return false;
    }

    const e = new FsEvent(key, oldValue, value, this.pid);

    return this.emit('fs-storage', e);
  }

  getItem(key: string): any {
    const item = this.metadata[key];

    if (item) {
      const filename = join(this.path, item.key);

      try {
        return readFileSync(filename, 'utf8');
      } catch (error) {
        this.removeItem(key);
      }
    }

    return undefined;
  }

  removeItem(key: string): boolean {
    const hasListeners = EventEmitter.listenerCount(this, 'fs-storage');
    const oldValue = hasListeners ? this.getItem(key) : undefined;

    const item = this.metadata[key];

    if (item) {
      delete this.metadata[key];
      this.length -= 1;
      this.bytesUsed -= item.size;
      this.keys.splice(item.index, 1);

      const metadataRef = this.metadata;

      metadataRef.forEach((k: any) => {
        const i = this.metadata[k];

        if (i.index > item.index) {
          i.index -= 1;
        }
      });

      const itemPath = join(this.path, item.key);

      try {
        this.deletePath(itemPath);
      } catch (error) {
        // NOTE: seems like path can't be deleted
      }

      if (!hasListeners) {
        return false;
      }

      const e = new FsEvent(key, oldValue, undefined, this.pid);

      return this.emit('fs-storage', e);
    }

    return false;
  }

  key(index: number): any {
    return this.keys[index];
  }

  clear(): boolean {
    this.deleteDirectory(this.path);

    this.length = 0;
    this.keys = [];
    this.metadata = new Map<string, FsItemMetadata>();
    this.bytesUsed = 0;

    const hasListeners = EventEmitter.listenerCount(this, 'fs-storage');

    if (!hasListeners) {
      return false;
    }

    const e = new FsEvent(undefined, undefined, undefined, this.pid);

    return this.emit('fs-storage', e);
  }

  private getStats(key: string): any {
    const filename = join(this.path, encodeURIComponent(key));

    try {
      return statSync(filename);
    } catch (error) {
      return undefined;
    }
  }

  private deleteDirectory(dirPath: string): void {
    const contents = readdirSync(dirPath);

    contents.forEach((path: string) => {
      const joined = join(dirPath, path);
      this.deletePath(joined);
    });
  }

  private deletePath(path: string): void {
    const isDirectory = statSync(path).isDirectory();

    if (isDirectory) {
      this.deleteDirectory(path);

      rmdirSync(path);
    } else {
      unlinkSync(path);
    }
  }

  private deleteInstance(): void {
    delete this.instances[this.path];
    this.deletePath(this.path);

    this.length = 0;
    this.keys = [];
    this.metadata = new Map<string, FsItemMetadata>();
    this.bytesUsed = 0;
  }
}
