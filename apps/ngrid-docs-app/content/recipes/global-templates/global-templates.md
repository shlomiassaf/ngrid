---
title: Global Templates
path: recipes/global-templates
parent: recipes
---
# Global Templates

**nGrid** provides a smart registry which enables template registration at multiple levels.

In most application a single top-level template registry is enough which means we only need to register templates once, outside of a grid
and have them ready to be used by the grid.

This can be done by creating a component which does nothing but declaring and registering templates.  
We can also use the component's class to apply logic, if required.

I> When implementing logic in such components note that the class instance is actually a singleton and it is shared across the application.

<div pbl-example-view="pbl-global-templates-example"></div>

You could simple render the component in your root application's component template, once for all application.
You can also do it using **nGrid** by importing the **nGrid** module:

```typescript
PblNgridModule.withCommon([ { component: CommonGridTemplatesComponent } ]),
```

Where `CommonGridTemplatesComponent` is the component with the templates.

If you have an application with multiple modules where you need some modules to have different templates or style
all you need to do is import with `withCommon` as shown above and also add a new registry level:

```typescript
@NgModule({
  declarations: [ CommonGridTemplatesComponent ],
  imports: [
    PblNgridModule.withCommon([ { component: CommonGridTemplatesComponent } ]),
  ],
  providers: [ PblNgridRegistryService], // NEW REGISTRY LEVEL
})
export class MyModule { }
```

Providing a new `PblNgridRegistryService` will make sure that when `CommonGridTemplatesComponent` is created it will
get a fresh new registry layer hence not overriding previous templates.

All components registered in `MyModule` will render grid's that use registries which are children of our new registry hence using the new templates!

