import { EmbeddedViewRef } from '@angular/core';

export function getRootElement<T extends HTMLElement = HTMLElement>(viewRef: EmbeddedViewRef<any>): T | undefined {
  return viewRef?.rootNodes[0];
}
