---
title: Performance
path: features/grid/virtual-scroll/performance
parent: features/grid/virtual-scroll
ordinal: 3
---

# Virtual Scroll Performance

Without virtual scrolling, loading a datasource with 10,000 rows will takes a lot of time and will probably freeze the browser.

With virtual scrolling loading is instant but it does not come for free, when scrolling the table will calculate the new scroll position matching
it to the rows that should appear in that scroll offset and render them on page.

When the offset is changing gradually the performance impact is minimal but when the change is rapid with large gaps there might be performance issues.

I> Performance issues means lower frame rate, which happens when it takes more time to render new rows. This is why larger offset means less performance
because more rows are rendered on each scroll.

Rapid scrolling with large offsets can occur when scrolling with the **wheel** or in mobile with **touch move**.

In most browsers, when rendering takes more time the end result is an empty table while scrolling. The rows we had at the start are long out of the view but new rows
did not have the time to render in the frame.

W> **wheelMode** works for wheel events, its does not apply for touch events. Messing around with touch behavior on mobile devices will
make the scrolling behavior feel un-natural. Scrolling in touch devices, using touch is always passive.

To tackle this the `[wheelMode]` mode directive offers 3 strategies:

## Passive (default)

Do nothing, let the browser handle the rendering and if no rows are shown while browsing let it be.

## Blocking

Do not let the browser scroll until all rows in the current offset are rendered.

This will result in a lower scrolling speed with the wheel but with a scrolling UX behavior. The scrolling speed
depends on the frame rate, at 60FPS you will not feel a thing but at 5 FPS the experience is bad.

## Threshold

Provide a frame rate threshold that define when to use **Passive** mode and when to use **Blocking** mode.

Each scrolling events start with the **Blocking** behavior but when the frame rate drops below the threshold the behavior
switch's to **Passive**.

It is always preferred to render at 60FPS but sometimes it is not possible and we can compromise on lower frame rate in favor of a real UI scroll feel.

Like all trade-offs, it is best to meet at middle ground. Provide a **threshold** within your limits, usually between 15 FPS to 25 FPS.

I> Measuring performance is tricky as it depends on the CPU power of the host, the complexity of the cells, the size of the viewport (row count) and the scroll speed.
Try to avoid complex cells, **Blocking** behavior and low **threshold** values.

I> For a live example see the [virtual scroll performance](../../../../demos/virtual-scroll-performance) demo.
