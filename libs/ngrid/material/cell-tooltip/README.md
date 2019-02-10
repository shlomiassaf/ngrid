# Cell Tooltip

A Plugin that pop's MatTooltip for Cells.

This is a top-level directive, applied on the table itself and prevents the need to set a tooltip instance for each cell instance.

Instead, the directive listens to cell enter/leave events and does it's thing.

Note that by default the tooltip is not displayed unless the content of the cell is in overflow.
This check is unique to the table theme and assume that each cell element has a DIV. The div is checked.

You can change this behavior.
