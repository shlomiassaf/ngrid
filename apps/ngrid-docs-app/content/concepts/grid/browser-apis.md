---
title: Compatibility & Browser APIs
path: concepts/grid/browser-apis
parent: concepts/grid
ordinal: 5
---
# Compatibility & Browser APIs

## Compatibility

**nGrid** support all browsers that angular & the angular CDK support.

## Browser APIs

**nGrid** makes use of the following browsers APIs:

### ResizeObserver

The [ResizeObserver API](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) is used to detect resize in column width's and react to them by re-calculating the new widths.

The **ResizeObserver API** is supported in all major browsers, however it is not supported by **Internet Explorer**  
If you require full support or want a polyfill just in case you can use one of the following polyfills:

- [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill) - The most used polyfill (performs auto-detect)
- [@juggle/resize-observer](https://github.com/juggle/resize-observer) - A newer, more modern polyfill (does NOT auto-detect)

You can add them to your `polyfill.ts` file.

I> There might be more differences between the 2, please read the documentation of each one for more in-depth information

**resize-observer-polyfill** will automatically detect if the API is implemented and if not will add it so you can safely do:

```typescript
import 'resize-observer-polyfill';
```

In your `polyfill.ts`.

Note the polyfill has built-in type support (d.ts) auto-loaded when you import it, so if you already have types
loaded for `ResizeObserver` and want to keep them, load the polyfill directly without passing through the `package.json`

```typescript
import 'resize-observer-polyfill/dist/ResizeObserver';
```

**@juggle/resize-observer** does not auto-detect so doing the above will override the native implementation, if one exists.

So you should do something like this:

```typescript
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';

if ('ResizeObserver' in window === false) {
    window.ResizeObserver = Polyfill;
}
```

There are more options for this polyfill, including a demo how to load it async using dynamic imports, read more at the polyfill's site.

I> **nGrid** makes minimal use of the API so changes in the final spec should have no effect.
@types/resize-observer-brow

### ResizeObserver Types

If you enable library type checking and TypeScript is complaining about `ResizeObserver` types missing, install the following:

```bash
yarn add -D @types/resize-observer-browser

# OR

npm install -D @types/resize-observer-browser
```

This should not happen as both polyfills come with types build in...

> If you have specific `types` defined in your `tsconfig.json` add it there as well.

### IntersectionObserver

The [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) is used for performance.

It allows **nGrid** to get notified when a row is visible and when it is not.  
With this API **nGrid** can skip a lot of layout reflows and recalculations because it does not need to check if a row is out of view.  
This is very important for performance, especially when using virtual scroll.

The **IntersectionObserver API** is a more mature API compared to the `ResizeObserver API`, it is shipped with all major browsers for a long time now
and comes as part of the DOM type library in TypeScript.

That said, it is not supported in Internet Explorer.

In this case we do not provide recommendation for a polyfill, you can use any good polyfill out there or you can **DISABLE** the use of the API
so **nGrid** will not use it to detect the changes and instead perform it's own magic for that. This will slightly degrade performance, how much
depends on the use case, **nGrid** instance configuration and features used together.

To disable the use of **IntersectionObserver** apply the following provider in your application root module:

```typescript
import { DISABLE_INTERSECTION_OBSERVABLE } from '@pebula/ngrid';

@NgModule({
  providers: [
    { provide: DISABLE_INTERSECTION_OBSERVABLE, useValue: true },
  ]
})
class MyAppRootModule { }
```
