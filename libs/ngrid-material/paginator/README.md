# Material Paginator implementation

A Plugin for `pbl-ngrid` with a `Paginator` implementation using components from `@angular/material`.

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
<pbl-ngrid>
  <pbl-ngrid-paginator *pblNgridPaginatorRef="let grid" [grid]="grid" [paginator]="grid.ds.paginator"></pbl-ngrid-paginator>
</pbl-ngrid>
```

> TIP: You can use `pblNgridPaginatorRef` outside of the table, (root component), to define a gloal paginator.
