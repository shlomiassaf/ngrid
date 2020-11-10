---
title: Unit Testing
path: concepts/testing/unit-testing
parent: concepts/testing
ordinal: 0
---
# Unit Testing

**nGrid** comes with built in helpers to support unit testing of the grid.

The helpers are actually classes that encapsulate internal logic done by the grid and allow the tester to focus on testing
what's required for the task at hand.

These classes are called [Component test harnesses](https://material.angular.io/cdk/test-harnesses/overview) and they are part
of the test harness suite provided by the angular cdk, you can read more about it [here](https://material.angular.io/cdk/test-harnesses/overview).

The helpers are not coupled with any testing framework or runners. You can use them with karma or with protractor to execute E2E tests.

I> Using the harness is optional, you can use them to test most of the scenarios however, if you need to use plain old unit testing
techniques you are free to do so.

## NGrid Component Harness

The main harness used to interact with **nGrid** is `PblNgridHarness` located in `@pebula/ngrid/testing`.  

From `PblNgridHarness` you can query for other harness components that wrap cells, columns, rows and other building blocks.

For example, `PblNgridHarness.getViewPortData()` will return a `string[][]` which represents the currently rendered row matrix
with cell data as it is rendered in the DOM.

`getViewPortData()` is helper function which uses the row harness component `PblNgridDataRowHarness` to get all rows
and in each row, the `PblNgridColumnHeaderCellHarness` component to get each cell.

I> The entire documentation site is using nGrid's test harness components.

## Testing nGrid with Jest using JSDom

The component harness helpers will work with any framework / runner, including Jest, however using Jest with JSDOM is not
recommended.

Wether you use the component harness or not, using Jest exposes a limited set of UI functionality when testing.  
This is true in general, but has a deep impact on big UI components like **nGrid**.

Jest uses JSDOM to allow fest unit testing but it comes with a cost, it is not a browser.  
There is no layout rendering, no CSS calculation, no scroll API support and more.

This does not allow proper UI testing for a component such as the grid.
For example, it is nearly impossible to deep test the grid with virtual scroll enabled since it is not possible to scroll.
This will also be true when working with grid's that have a lot of columns which exceed the viewport size, you will not be able
to bring them into the view, no scrolling.

That being said, if you're already using Jest you might not have any other option but to use it.  
The component harness helpers will work but some functionality will not.

You will be able to test columns, data and other functionality but not all.
