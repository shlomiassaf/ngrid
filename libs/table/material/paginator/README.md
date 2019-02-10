# Material Paginator implementation

A Plugin for `pbl-table` with a `Paginator` impelementation using components from `@angular/material`.

## Impotred `@angular/material` modules

- MatPaginatorModule ('@angular/material/paginator')  
  * `MatPaginator`
- MatSelectModule ('@angular/material/select')  
  * `MatSelect`
- MatTooltipModule ('@angular/material/tooltip')  
  * `MatToolTip`
- MatButtonModule ('@angular/material/button')  
  * `MatButton`

## Usage

**Using a component & the paginator ref instruction**

```html
<pbl-table>
  <pbl-table-paginator *pblTablePaginatorRef="let table" [table]="table" [paginator]="table.ds.paginator"></pbl-table-paginator>
</pbl-table>
```

> TIP: You can use `negTablePaginatorRef` outside of the table, (root component), to define a gloal paginator.
