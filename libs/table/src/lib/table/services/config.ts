import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export interface SgTableConfig { }

export const SG_TABLE_CONFIG = new InjectionToken<SgTableConfig>('SG_TABLE_CONFIG');

@Injectable({
  providedIn: 'root',
})
export class SgTableConfigService {
  private config: SgTableConfig = {} as any;

  constructor(@Optional() @Inject(SG_TABLE_CONFIG) _config: SgTableConfig) {
    if (_config) {
      Object.assign(this.config, _config);
    }
  }

  has(section: keyof SgTableConfig): boolean {
    return this.config.hasOwnProperty(section);
  }

  get<T extends keyof SgTableConfig>(section: T): SgTableConfig[T] | undefined {
    return this.config[section];
  }
}
