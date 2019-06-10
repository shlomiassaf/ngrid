import { Observable, ReplaySubject } from 'rxjs';

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export interface PblNgridConfig {
  table?: {
    showHeader?: boolean;
    showFooter?: boolean;
    noFiller?: boolean;
    boxSpaceModel?: 'padding' | 'margin';
  }
}

const DEFAULT_TABLE_CONFIG: PblNgridConfig['table'] = {
  showHeader: true,
  showFooter: false,
  noFiller: false,
  boxSpaceModel: 'padding',
};

export const PEB_NGRID_CONFIG = new InjectionToken<PblNgridConfig>('PEB_NGRID_CONFIG');

@Injectable({
  providedIn: 'root',
})
export class PblNgridConfigService {

  private config = new Map<keyof PblNgridConfig, any>();
  private configNotify = new Map<keyof PblNgridConfig, ReplaySubject<any>>();

  constructor(@Optional() @Inject(PEB_NGRID_CONFIG) _config: PblNgridConfig) {
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

  has(section: keyof PblNgridConfig): boolean {
    return this.config.has(section);
  }

  get<T extends keyof PblNgridConfig>(section: T): PblNgridConfig[T] | undefined {
    return this.config.get(section);
  }

  set<T extends keyof PblNgridConfig>(section: T, value: PblNgridConfig[T]): void {
    const prev = this.get(section);
    value = Object.assign({}, value);
    Object.freeze(value);
    this.config.set(section, value);
    this.notify(section, value, prev);
  }

  onUpdate<T extends keyof PblNgridConfig>(section: T): Observable<{ curr: PblNgridConfig[T]; prev: PblNgridConfig[T] | undefined; }> {
    return this.getGetNotifier(section);
  }

  private getGetNotifier<T extends keyof PblNgridConfig>(section: T): ReplaySubject<any> {
    let notifier = this.configNotify.get(section);
    if (!notifier) {
      this.configNotify.set(section, notifier = new ReplaySubject<any>(1));
    }
    return notifier;
  }

  private notify<T extends keyof PblNgridConfig>(section: T, curr: PblNgridConfig[T], prev: PblNgridConfig[T]): void {
    this.getGetNotifier(section).next({ curr, prev });
  }
}
