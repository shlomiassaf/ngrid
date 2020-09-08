# Examples

This folder `apps/libs/ngrid-examples` contains examples used in the documentation app.

Each example is a standalone component that is dynamically rendered into the HTML

## NgModule separation

Examples are grouped into multiple modules, with a simple rule of thumb, group very few components under the same module.
Usually, groups are by feature/concept/doc section.

This might seems verbose but it creates a boundary between the examples, preventing the leak of imported modules between them thus
allow better testing for each example.

For example, if example A showcase's a feature that requires an ngrid plugin PA, we will import it into the module.
If we add example B into the module, showcasing something else, it will be able to consume plugin PA as they are both in the same module.

Now, we will not be able to determine if the feature in example B does not depend on the plugin PA, unless it has no access to it.
This is why all examples are contained.

## Adding examples

Examples are added through a local dedicated schematic called **example-module**

The schematic will create a dedicated module for each example
and attach a component to it.

> You can create multiple components for the same module.

`./node_modules/.bin/nx workspace-schematic example-module <EXAMPLE NAME>`

Where `<EXAMPLE NAME>` is the name of the example.

The `<EXAMPLE NAME>` is used to create files and folders, name the
component class, the module and the selector.

E.G: If the example name is **SelectionColumn** it will create

- A directory with the name `selection-column` containing:
- The file `selection-column.module.ts` with the module `SelectionColumnExampleModule`
- The file `selection-column.component.ts` with the component class `SelectionColumnExample` using the selector `pbl-selection-column-example`
- Additional `html` and `scss` files matching the component's filename.

### Prefixing with a path

By default, the directory for the module and component will be created
in the root of `ngrid-examples` but you can append a path

```bash
./node_modules/.bin/nx workspace-schematic example-module my/path/SelectionColumn
```

The command above will create the folders `my/path/selection-column` and inside it will generate the module and component files.

### Adding multiple examples per module

You can use the argument `--add` to create additional components.

`./node_modules/.bin/nx workspace-schematic example-module <EXAMPLE NAME> --add <OTHER_NAME1>,<OTHER_NAME2>`

Names are comma separated.

If the `<EXAMPLE NAME>` already exists it will only add the additional components to the module.

There is an npm script called example:

```bash
npm run example -- plugins/ngrid-material/SelectionColumn --add BulkModeAndVirtualScroll
```

## Console output

For each run, the schematic will output markdown/html code and a list of files it updates/created.

The markdown/html code is a basic template the can be used as content 

For example, running:

```bash
npm run example -- features/built-in-plugins/Transpose --add OriginalTemplates,WithColumnStyles
```

Will generate the following output in the console:

```md
---
title: Transponse
path: features/built-in-plugins/transponse
parent: features/built-in-plugins
---
# Transponse

<div pbl-example-view="pbl-transponse-example"></div>

<div pbl-example-view="pbl-original-templates-example"></div>

<div pbl-example-view="pbl-with-column-styles-example"></div>
```

The first section is the `gray-matter` information that provide metadata information about the page.

The last section is html code that will cause the page to render the example components.

> If the module and first example already exists and you are only adding more example, only the last part will show.

## Anatomy of an example module

As stated, example components come inside an example module with a module having at least one component example bound to it.

To identify an example, it is prefixed with the `@Example` decorator, allowing custom metadata attached to the example:

```ts
import { Example } from '@pebula/apps/shared';

@Component({ /* ANGULAR METADATA */ })
@Example('pbl-my-example', { title: 'CMy Example' })
export class MyExample { }
```

> The example module schematic will create this for you.

In addition, we need to map each component to it's module:

```ts
import { BindNgModule } from '@pebula/apps/shared';

@NgModule({
  declarations: [ MyExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ MyExample ],})
BindNgModule(MyExample);
export class MyExampleModule { }
```

We need to bind components to module so the dynamic component renderer will know which module to use to create a component.

> The component/module binding is already done in the angular `NgModule` metadata, but this information is not accessible outside of angular.

> The example module schematic will create this for you.
