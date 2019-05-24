# TSConfig Paths setup

The `paths` in this project are set to reflect the real life usage of the library with the `@pebula` scope.

The basic structure for all libraries is:

    .
    ├── libs
    ├── [LIBRARY NAME]                # The name of the library
    │   ├── src                       # All source code is inside this folder
    │   │   ├── lib                   # All source code is inside this folder
    │   │   └── index.ts              # Main export file
    │   │
    │   ├── [SECONDARY LIBRARY #1]    # Secondary package (OPTIONAL)
    │   │   └── src
    │   │       ├── lib
    │   │       └── index.ts
    │   │
    │   └── [SECONDARY LIBRARY #n]...
    │
    └──

Each library has it's own dedicated folder and all source code is inside the `src` folder. Actual source code lives within `src/lib` and a `src/index.ts` exports the **public** API.

## Main package mappings

The most basic `paths` entry is:

```
  "@pebula/*": [
    "libs/*/src/index.ts",
    "libs/*"
  ]
```

The above should catch most imports, including secondary routs (e.g. `@pebula/ngrid/drag`).

This is set last because it is very generic and used as last resort. More specific
path mappings are set before this one.

## Augmentation support

The main package mappings will point to the the `src/index.ts` file that exports the **public** API, as seen above.

This will work for all imports except **augmentation**.

Augmentation is a special use case where we want to **extends** a type and for this
we need to point to the exact location (file) that the type is declared in.

For example:

```ts
declare module '@pebula/ngrid/lib/table/columns/types' {
  interface PblColumnTypeDefinitionDataMap {
    currencyFn: (row: Person) => string;
    countryNameDynamic: (row: Person) => string;
  }
}
```

Notice the path we reference: `declare module '@pebula/ngrid/lib/table/columns/types'`

We point to `@pebula/ngrid/lib` but the file is actually in `@pebula/ngrid/src/lib`.

This is required because the `dist` output structure is without the `src` folder and we need to make sure our code will work locally and with the `dist` version.

To make this work we add additional path mappings:

```
  "@pebula/ngrid/lib/*": [
    "libs/ngrid/src/lib/*"
  ],
  "@pebula/ngrid-material/lib/*": [
    "libs/ngrid-material/src/lib/*"
  ]
```

For each library that we want augmentation support we add an additional record.

These records must be set **before** the main package mappings.

## Dist mappings

Up to this point we described the mappings in `tsconfig.json` file at the root of this project. This is used in development mode along with webpack.

When we build the libraries (`npm run build-grid`) we use the `tsconfig.lib.json` file, also located at the root of the project.

This file is used to provide mappings when building package so if a package being built
is referencing another package (local one) they will have proper mappings.

This means that packages must be built in order (dependency tree).

This file has different mappings, more simple:

```
  "@pebula/*": [
    "dist/@pebula/*"
  ]
```
