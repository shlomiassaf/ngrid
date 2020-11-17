import { PblCdkVirtualScrollViewportComponent } from './virtual-scroll-viewport.component';

export function createScrollWatcherFn(vScrollViewport: PblCdkVirtualScrollViewportComponent) {
  let scrolling = 0;
  let lastOffset = vScrollViewport.measureScrollOffset();

  return () => {
    /*  `scrolling` is a boolean flag that turns on with the first `scroll` events and ends after 2 browser animation frames have passed without a `scroll` event.
        This is an attempt to detect a scroll end event, which does not exist.

        `scrollFrameRate` is a number that represent a rough estimation of the frame rate by measuring the time passed between each request animation frame
        while the `scrolling` state is true. The frame rate value is the average frame rate from all measurements since the scrolling began.
        To estimate the frame rate, a significant number of measurements is required so value is emitted every 500 ms.
        This means that a single scroll or short scroll bursts will not result in a `scrollFrameRate` emissions.

    */
    if (scrolling === 0) {
      /*  The measure array holds values required for frame rate measurements.
          [0] Storage for last timestamp taken
          [1] The sum of all measurements taken (a measurement is the time between 2 snapshots)
          [2] The count of all measurements
          [3] The sum of all measurements taken WITHIN the current buffer window. This buffer is flushed into [1] every X ms (see buggerWindow const).
      */
      const bufferWindow = 499;
      const measure = [ performance.now(), 0, 0, 0 ];
      const offset = vScrollViewport.measureScrollOffset();
      if (lastOffset === offset) { return; }
      const delta = lastOffset < offset ? 1 : -1;

      vScrollViewport.scrolling.next(delta);

      const raf = () => {
        const time = -measure[0] + (measure[0] = performance.now());
        if (time > 5) {
          measure[1] += time;
          measure[2] += 1;
        }
        if (scrolling === -1) {
          scrolling = 0;
          lastOffset = vScrollViewport.measureScrollOffset();
          vScrollViewport.scrolling.next(0);
        }
        else {
          if (measure[1] > bufferWindow) {
            measure[3] += measure[1];
            measure[1] = 0;
            vScrollViewport.scrollFrameRate.emit(1000 / (measure[3]/measure[2]));
          }
          scrolling = scrolling === 1 ? -1 : 1;
          requestAnimationFrame(raf);
        }
      };
      requestAnimationFrame(raf);
    }
    scrolling++;
  }
}
