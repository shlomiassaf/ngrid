import { Observable, ReplaySubject } from 'rxjs';

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export interface NegTableConfig {
  table?: {
    showHeader?: boolean;
    showFooter?: boolean;
    boxSpaceModel?: 'padding' | 'margin';
  }
}

const DEFAULT_TABLE_CONFIG: NegTableConfig['table'] = {
  showHeader: true,
  showFooter: false,
  boxSpaceModel: 'padding',
};

export const NEG_TABLE_CONFIG = new InjectionToken<NegTableConfig>('NEG_TABLE_CONFIG');

@Injectable({
  providedIn: 'root',
})
export class NegTableConfigService {

  private config = new Map<keyof NegTableConfig, any>();
  private configNotify = new Map<keyof NegTableConfig, ReplaySubject<any>>();

  constructor(@Optional() @Inject(NEG_TABLE_CONFIG) _config: NegTableConfig) {
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

  has(section: keyof NegTableConfig): boolean {
    return this.config.has(section);
  }

  get<T extends keyof NegTableConfig>(section: T): NegTableConfig[T] | undefined {
    return this.config.get(section);
  }

  set<T extends keyof NegTableConfig>(section: T, value: NegTableConfig[T]): void {
    const prev = this.get(section);
    value = Object.assign({}, value);
    Object.freeze(value);
    this.config.set(section, value);
    this.notify(section, value, prev);
  }

  onUpdate<T extends keyof NegTableConfig>(section: T): Observable<{ curr: NegTableConfig[T]; prev: NegTableConfig[T] | undefined; }> {
    return this.getGetNotifier(section);
  }

  private getGetNotifier<T extends keyof NegTableConfig>(section: T): ReplaySubject<any> {
    let notifier = this.configNotify.get(section);
    if (!notifier) {
      this.configNotify.set(section, notifier = new ReplaySubject<any>(1));
    }
    return notifier;
  }

  private notify<T extends keyof NegTableConfig>(section: T, curr: NegTableConfig[T], prev: NegTableConfig[T]): void {
    this.getGetNotifier(section).next({ curr, prev });
  }
}
