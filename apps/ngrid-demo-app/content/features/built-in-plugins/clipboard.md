---
title: Clipboard
path: features/built-in-plugins/clipboard
parent: features/built-in-plugins
ordinal: 3
tags: copy,paste,excel
---
# Clipboard

The clipboard plugin adds a *"Copy to Clipboard"* functionality to the grid by copying the current selected cell/s into the clipboard.

---

The clipboard plugin depends on the **[target-events](../target-events)** plugin.  
If the **[target-events](../target-events)** plugin is not initialized the clipboard plugin will initialize it.

---

The default behavior of the plugin is to copy the data in the selected cells into the clipboard when `CTRL + C` is pressed (`CMD + C` in OSX).

When multiple cells are selected, they are separated by the `TAB` character.

<!-- Taken from Extending NGrid -->
<div pbl-example-view="pbl-copy-selection-example"></div>

I> The clipboard plugin development process is used as a case-study in the [Extending NGrid](../../../extending-ngrid#example-copy-to-clipboard-plugin) how-to page.
