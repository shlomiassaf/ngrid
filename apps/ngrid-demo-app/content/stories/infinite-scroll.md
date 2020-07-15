---
title: Infinite Scroll
path: stories/infinite-scroll
parent: stories
ordinal: 3
---
# Infinite Scroll

Infinite scrolling provides the feeling of an infinite grid where the user scroll and scrolls until no more data is available but the
data is loaded in incremental steps, every time the grid is scrolling to the end a new dataset is fetched from the server.

We've covered the 2 datasource modes and how we can use them, let's recap:

1. **Client Mode** 
The entire dataset is provided once. Sorting, pagination and filtering are done on the client without calling an external source.

2. **Server Mode**
The dataset is provided from the server in chunks. Sorting, pagination and filtering are done on the server.

**Infinite scrolling** is not a mode per-se as it can work with both modes above but it is actually used when working with the server.  

**Infinite scrolling** is an alternative to **pagination**, instead of the user having to click on a button/link to navigate between the next/pervious chunk of the dataset
with **Infinite scrolling** the next/pervious chunk is loaded automatically based on the user's scroll position.

I> **Infinite scrolling** & **Virtual scrolling** are often mis-understood.  
- Virtual scroll enable the display of large datasets in the grid
- Infinite scroll enable seamless lazy loading of additional data rows into the grid  
Usually you will use both together, especially when using infinite scroll to add row (as opposed to replacing rows)

We can provide a naive infinite scrolling without external helpers:

<div pbl-example-view="pbl-infinite-scroll-example"></div>
