import { ɵsetRootDomAdapter as setRootDomAdapter } from '@angular/platform-browser';
import { DominoAdapter } from './domino-adapter';

export class StangaDominoAdapter extends DominoAdapter {
  static makeCurrent() {
    // we call `setRootDomAdapter` first which will make it the root DOM adapter for life!
    setRootDomAdapter(new StangaDominoAdapter());
    DominoAdapter.makeCurrent();
  }

  setInnerHTML(el: Element, value: string) {
    el.innerHTML = value;
  }

  setAttribute(element: Element, name: string, value: string) {
    element.setAttribute(name, value);
  }
  setAttributeNS(element: Element, ns: string, name: string, value: string) {
    element.setAttributeNS(ns, name, value);
  }
}
