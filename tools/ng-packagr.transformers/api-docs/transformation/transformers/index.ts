// Add div, based on remark-html
declare module 'mdast' {
  export interface Div extends Parent<'div', Content> { }
  interface MdTypeMap {
    div: Div;
  }
}

import './package';
import './function';
