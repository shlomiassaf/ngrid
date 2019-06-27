import { Component, Attribute } from '@angular/core';

@Component({
  selector: 'docsi-bt-compile-markdown',
  template: '',
})
export class BtCompileMarkdownComponent {
  constructor(@Attribute('src') src: string) {
    throw new Error(`Invalid BtCompileMarkdownComponent: ` + src);
  }
}
