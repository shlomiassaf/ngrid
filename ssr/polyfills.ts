if (typeof global.requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = (fn => {
    setTimeout(fn, 16);
  }) as any;
}
