import { Inject, PLATFORM_ID, Injectable } from '@angular/core';
import { MemoryCacheService as _MemoryCacheService } from '@ngx-cache/platform-browser';

@Injectable()
export class MemoryCacheService extends _MemoryCacheService {
  constructor(@Inject(PLATFORM_ID) platformId: any) {
    super(platformId)
  }
}
