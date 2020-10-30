# Documentation App

The documentation application (**docs app**) is used to document and showcase the libraries in the repository.

To simplify the process of documentation, all documents are written in `markdown`. Since `markdown` is static
a mechanism was set in place to support dynamic rendering of angular components accompanied with it's source code.

Of course, `markdown` is not supported in angular so it is converted to HTML in the build process
including processing of source code so it can be viewed in the HTML. This is done in internal libraries.

## Application Content

Application content, which is the documentation files written in `markdown` are location in `apps/content`.

Each file is first processed with `gray-matter` so attributes can be added to each file (page). These attributes
can be the page title, path, tags and more...

> Each file in the directory is monitored for changes but the entire directory is not monitored, so adding a new file
in development will not trigger a refresh, the workaround is to add a file and then save any other arbitrary markdown file
to trigger a new folder scan.

Static documents are boring, we want live examples with source code... This is possible by referencing
dynamic angular component selector in `markdown` code.

> The components are defined in specific locations, which we will cover ahead.

### Showcasing with source code

To showcase a feature with source code attached use the following html syntax **within** the `markdown`:

```html
<div pbl-example-view="pbl-cell-tooltip-example"></div>
```

With `pbl-cell-tooltip-example` being the selector of the angular component to inject.

> TODO: document supported attributes (inputParams, containerClass, etc...)

The source code will be process into HTML using the processor defined (e.g. prism, highlightJs) and serialized into a json file
to be consumed by the browser on demand (when the user want to view the source code).

> Source code JSON file names are hashed, so caching is applied by the browser automatically and invalidates automatically on change.

### Running angular code in markdown

Running angular code in markdown is similar to showcasing but without the source code view support.

```html
<div pbl-app-content-chunk="pbl-columns-app-content-chunk" inputs='{ "section": 2 }'></div>
```

With `"pbl-columns-app-content-chunk` being the selector of the angular component to inject.

> TODO: document supported attributes (inputParams, containerClass, etc...)

## Application Code

The application code is located in `apps/ngrid-demo-app/src`.
The application itself is lightweight, containing small amounts of angular code while most of the code is
located in the `apps/libs` folder.

### apps/libs/shared

This folder contains an internal library which is an angular module used by the docs app.

This module contains components and services used to display compiled markdown content, menu and dynamic components (with source code or without).
It also contains other directives, services, pipes used by the docs app.

### apps/ngrid-demo-app/content

This folder contains feature modules with each module showcasing one or more components.

To showcase a feature with source code attached use the following html syntax **within** a `markdown` file:

```html
<div pbl-example-view="pbl-cell-tooltip-example"></div>
```

The is a custom schematic you can use to generate an example module/component.  
The schematic will create the module and provide a blueprint `markdown` file for your.

> For more information how to use the schematic and about the examples section, see [DOCS_APP_MATERIAL_EXAMPLES](DOCS_APP_MATERIAL_EXAMPLES.md)

Once an example module is defined, it must be registered in the root application module. Each example module can be synchronous or asynchronous (lazy loaded module), depending on how it is registered in the root application module.

Synchronous modules will be referenced directly in the application module so using them is straight forward.

Asynchronous modules are referenced in-directly, the same way we register angular lazy loaded modules in the router.

Using a custom angular module preloader (`LazyModulePreloader`) provided in the shared module (`apps/libs/shared`) all of these
modules are loaded and registered.

> Asynchronous modules are preferred as they reduce the initial bundle size of the application
