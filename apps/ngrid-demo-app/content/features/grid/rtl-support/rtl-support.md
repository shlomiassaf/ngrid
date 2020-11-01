---
title: RTL Support
path: features/grid/rtl-support
parent: features/grid
tags: directionality,bidi,layout
---
# RTL Support

nGrid support for RTL layout direction is straight-forward:

```html
<pbl-ngrid [dataSource]="ds" [columns]="columns" dir="rtl"></pbl-ngrid>
```

<div pbl-example-view="pbl-rtl-support-example"></div>

## Application wide layout support

RTL/RTL support is part of the angular CDK `bidi` package which implement an application wide layout support for RTL/RTL layouts.

You can apply the layout per grid (as seen above), per **section** or per **application**.

<div pbl-example-view="pbl-application-level-rtl-example"></div>

In the example above, there is no specific layout defined.
You can still switch between layout's, RTL or LTR, by toggling the RTL switch toggle button on the top toolbar.

Since the top example explicitly set's the directionality, it does not react to changes in the top level directionality state, it has its
own internal state.

I> Read more about the CDK `bidi` package and **Directionality** on the [CDK website](https://material.angular.io/cdk/bidi/overview)
