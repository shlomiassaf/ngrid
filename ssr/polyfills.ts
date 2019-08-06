// working around:
// https://github.com/angular/components/blob/461d5390d95732544db506fb6c6536f3a5803065/src/cdk-experimental/popover-edit/polyfill.ts#L40
if (typeof global.Element === 'undefined') {
  global.Element = class {};
}

if (typeof global.requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = fn => {
    setTimeout(fn, 16);
  }
}
