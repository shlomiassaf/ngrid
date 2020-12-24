---
title: CSS Classes
path: concepts/grid/css-classes
parent: concepts/grid
ordinal: 3
---
# CSS Classes

| Class | Description         | Applied To
|-------|---------------------|-------------------------------------------
| `.pbl-ngrid-row` / `.pbl-ngrid-header-row` / `.pbl-ngrid-footer-row` | Indicate that this is the row container | Row element
| `.pbl-ngrid-cell` / `.pbl-ngrid-header-cell` / `.pbl-ngrid-footer-cell` | Indicate that this is the cell container | Cell element
| `.pbl-ngrid-cell-ellipsis` / `.pbl-ngrid-header-cell-ellipsis` / `.pbl-ngrid-footer-cell-ellipsis` | Wrap the respective cell's text and prevent it from breaking to a new line using ellipsis (...).<br>**Apply on the root element**: `<pbl-ngrid class="pbl-ngrid-cell-ellipsis">` | Root element
| `.pbl-ngrid-first-header-row` / `.pbl-ngrid-last-header-row` | Indicate that the header row is first / last (taking into account the row's type) | Row element
| `.pbl-ngrid-first-footer-row` / `.pbl-ngrid-last-footer-row` | Indicate that the footer row is first / last (taking into account the row's type) | Row element
| `.pbl-ngrid-empty` | Indicate that the grid is empty (no rows) | Root element
| `.pbl-ngrid-scrolling` | Indicate that grid is being scrolled | Root element
