# NX project tags

The tags in each project describe the project's type.

The structure and format of these tags is based on a schema and format, there are 2 tags shared by all projects:

- name: An optional name, used as a unique key. (when not set, the projects key is used).
- type: An internal type for this project, extending the `projectType` from the angular CLI.

## Project Name

The project name is optional and when not set, taken from the key that the tags array is hosted in.

The name plays a key role when parent/child relationships are set.

## Project type

The angular CLI is where are project's are defined, including the project type, which can be one of:

- application
- library

These types alone can not support complex relationships within a mono-repo, few examples:

- A `library` can also be a feature module of an app (not a public library)
- A `library` can also be a secondary endpoint within another library.
- A `library` can also be a node library (not UI library)

To support this we need more types and so each project must have a **type** tag in format `type:[TYPE]` where `[TYPE]` is the actual type value.

There are 2 type groups, parent and children:

Parent

- **app**
- **lib**
- lib-node

Children

- e2e-app
- child-app
- child-lib
- child-lib-node

The type tag's represent relationships and constraints. Because each project in the CLI is either **application** or **library** it means
that each of the tags type will match to one of the CLI project types.

**app** & **lib** are highlighted because they directly match to **application** & **library** respectively.

### Parent Type

A parent type describes a project that **might** have child projects. The relationship is based on the context.

- app: A CLI **application** project
- lib: A CLI **library** project
- lib-node: A CLI **library** project for the `node` runtime.

> **lib-node** is a private case of **lib**, which means a library for the `node` runtime.

### Child Type

A child type describe the relationship with a parent CLI project. There is only one parent and it is mandatory to define it.

To describe a parent it is mandatory to add a tag in format `parent:[NAME]` where `[NAME]` is the actual name of the parent project.

> Note the `[NAME]` must match an exiting project

- e2e-app: A CLI **application** project for e2e testing, the parent is the **application** it "tests"
- child-app: A CLI **library** project that is used as a feature module for a CLI **application**. The parent is the **application** it is a feature module for.
- child-lib: A CLI **library** project that is a secondary entry point within an other **library**. The parent is the **library** one level above it. Note that "secondary" entry point is a term, the depth of entry points is not limited to 2.
- child-lib-node: A CLI **library** project that is a secondary entry point within an other **library**. The parent is the **library** one level above it. Note that "secondary" entry point is a term, the depth of entry points is not limited to 2.
