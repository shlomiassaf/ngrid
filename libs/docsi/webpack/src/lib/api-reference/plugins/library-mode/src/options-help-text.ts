export const libraryType = `The structure of the library.
  - standalone
    A Single library
    
  - monorepo
    A multi-library project with multiple libraries under the same documentation app.
    Usually under an NPM scope.
    This mode assumes/expects a file structure where each library is in a dedicated directory and
    that is the root of the library and contains a "package.json" file.
    
    The structure is crucial for automatic library detection and dependency hierarchy.
    
  Default: standalone`;

export const standaloneMode = `The standalone structure to use.
By default (false), the standalone structure is setting all reflections as children of the project's
root reflection.

You can choose a specific container for the reflections so they are not children of the project
but children of that container and the container is the sole child of the project.
This is done by setting a string value that will also serve as the name of the container.
  - string  : Add a container between project and reflections and set it's name to the string value.
  - false   : The project is the container for the reflections`;

export const enforcePublicApi = `Public API mode.
This mode will mark all reflections as private unless they are exported from the main entry point.

Allowed values:
  - true    : Turn ON  "Public API" mode, the plugin will try to evaluate the entry file through
              a dependency graph. (recommended)
  - string  : Turn ON  "Public API" mode and export from the specific path supplied (Absolute path)
  - string[]  : Turn ON  "Public API" mode and export from the specific paths supplied (Absolute path)
  - false   : Turn OFF "Public API" mode. (default)
  
Public API enforcement is available for "standalone" and "monorepo" types`;