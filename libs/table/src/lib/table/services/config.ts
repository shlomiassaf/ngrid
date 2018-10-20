import { Observable, ReplaySubject } from 'rxjs';

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export interface SgTableConfig {
  table: {
    showHeader?: boolean;
    showFooter?: boolean;
    boxSpaceModel?: 'padding' | 'margin';
  }
}

const DEFAULT_TABLE_CONFIG: SgTableConfig['table'] = {
  showHeader: true,
  showFooter: false,
  boxSpaceModel: 'padding',
};

export const SG_TABLE_CONFIG = new InjectionToken<SgTableConfig>('SG_TABLE_CONFIG');

@Injectable({
  providedIn: 'root',
})
export class SgTableConfigService {

  private config = new Map<keyof SgTableConfig, any>();
  private configNotify = new Map<keyof SgTableConfig, ReplaySubject<any>>();

  constructor(@Optional() @Inject(SG_TABLE_CONFIG) _config: SgTableConfig) {
    if (_config) {
      for (const key of Object.keys(_config)) {
        (this.config as any).set(key, _config[key]);
      }
    }

    const tableConfig = this.config.get('table') || {};
    this.config.set('table', {
      ...DEFAULT_TABLE_CONFIG,
      ...tableConfig,
    });
  }

  has(section: keyof SgTableConfig): boolean {
    return this.config.has(section);
  }

  get<T extends keyof SgTableConfig>(section: T): SgTableConfig[T] | undefined {
    return this.config.get(section);
  }

  set<T extends keyof SgTableConfig>(section: T, value: SgTableConfig[T]): void {
    const prev = this.get(section);
    value = Object.assign({}, value);
    Object.freeze(value);
    this.config.set(section, value);
    this.notify(section, value, prev);
  }

  onUpdate<T extends keyof SgTableConfig>(section: T): Observable<{ curr: SgTableConfig[T]; prev: SgTableConfig[T] | undefined; }> {
    return this.getGetNotifier(section);
  }

  private getGetNotifier<T extends keyof SgTableConfig>(section: T): ReplaySubject<any> {
    let notifier = this.configNotify.get(section);
    if (!notifier) {
      this.configNotify.set(section, notifier = new ReplaySubject<any>(1));
    }
    return notifier;
  }

  private notify<T extends keyof SgTableConfig>(section: T, curr: SgTableConfig[T], prev: SgTableConfig[T]): void {
    this.getGetNotifier(section).next({ curr, prev });
  }
}
