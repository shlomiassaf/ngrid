# Examples

This folder contains examples used in the documentation app.

Each example comes within its own module and all example modules are imported into a single exported module.

This might seems verbose but it creates a boundray between the examples, preventing the leak of imported modules between them thus
allow better testing for each example.

For example, if example A showcase's a feature that requires an ngrid plugin PA, we will import it into the module.
If we add example B into the module, showcasing something else, it will be able to consume plugin PA as they are both in the same module.

Now, we will not be able to determine if the feature in example B does not depend on the plugin PA, unless it has no access to it.
This is why all examples are contained.
