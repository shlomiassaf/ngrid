# Project file structure

## apps

All folders in this directory are angular applications except for the **apps/libs** directory.

The **apps/libs** directory contains library like modules that are feature modules consumed by applications in this directory.

The project is configured with path mappings so `@pebula/apps/X` will point to `app/libs/x`.

The main application is the documentation app that is used to document and showcase the libraries.  
The doc's app is built from MD files and source code which is not native to angular so internal plugins
are used in the build process to make sure this is supported.

For more information see [DOCS_APP](./DOCS_APP.md)

## libs

Library source code.
Code in this folder will is what published as npm packages.

Each folder is a standalone npm package.

## libs-internal

Internal libraries that support the build process of demo app.
These libraries usually integrate with webpack and transform the build process in one way or another.

## tools

Internal tools custom made for this repo.

## dev_docs

Folder that contains internal documentation related to developers and not to users of the grid.
