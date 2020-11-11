# Refactor Items

## [1] Add support in the RowApi to find rows/cells based on various inputs  

- Input of an HTML element to get a row or a cell.
- Input of row ident to get row or row ident + column id to get cell

We then refactor **target-events** to use this API.

Search for this reference in the code to see where refactor is needed
