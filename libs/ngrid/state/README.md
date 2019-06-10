# State plugin

Serialize / Deserialize the grid.

## Overview

The state plugin introduce the ability to persist the state of a grid, per grid instance.  
This includes information from the grid and internal components in the grid as well as plugins that might require such capability.

To manage the state there are 3 requirements:

1. Identifying the grid
2. Saving and loading from a datasource
3. Extracting and assigning values.

## Identifying the grid

Because we need to store and retrieve the state we must identify the grid we are working with.
This is done through the `PblNgridIdentResolver` adapter, which the user can replace at will.

The plugin comes with the built in adapter `PblNgridIdAttributeIdentResolver` which relays on the
`id` attribute to uniquely identify a grid.

You can go wild here, identifying based on hash's, routes, etc...

## Saving and loading from a datasource

We can store and retrieve the state in many ways, remotely or locally.
This is done through the `PblNgridPersistAdapter` adapter, which the user can replace at will.

The plugin comes with the built in adapter `PblNgridLocalStoragePersistAdapter` uses local storage to store and retrieve the state.

## Extracting and assigning values

Extracting and assigning values simply means:

- Update the grid when we load state and want to restore it.
- Extracting values from the grid and setting them on the state.

Because the plugin must support complex data structures and external plugin integration the entire state
is split into chunks, each chunk contains a portion of the data.

Each chunk is also responsible to provide the logic for moving from the chunk to the grid and vice versa.

### TODO

More about chunks, root and child.
More about include/exclude and how to define them.
More about presets
