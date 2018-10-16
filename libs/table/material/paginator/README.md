# Material Paginator implementation

A Plugin for `sg-table` with a `Paginator` impelementation using components from `@angular/material`.

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
<sg-table>
  <sg-table-paginator *sgTablePaginatorRef="let table" [table]="table" [paginator]="table.dataSource.paginator"></sg-table-paginator>
</sg-table>
```

> TIP: You can use `sgTablePaginatorRef` outside of the table, (root component), to define a gloal paginator.
