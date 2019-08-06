declare module NodeJS  {
  interface Global {
    Element: any;
    requestAnimationFrame(fn: Function): void;
  }
}
