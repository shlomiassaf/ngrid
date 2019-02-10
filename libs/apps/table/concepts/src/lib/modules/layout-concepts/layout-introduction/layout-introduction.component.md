# The Table Layout

The table's main goal is to display rows of data but it might also contain other things like pagination, action rows or any other thing you can think of, not limited to the shape of a row.

The layout is built from 3 sections:

- Outer Top
- Inner
- Outer Bottom

<div fxLayout>
  <div fxFlex="50%">

```html
<pbl-table>
  <!-- Outer Top section -->
  <!-- Inner section -->
  <!-- Outer Bottom -->
</pbl-table>
```

  </div>
  <div fxFlex="50%">
    <pbl-table showFooter vScrollNone
              [columns]="columns" [dataSource]="ds">
      <div *negTableOuterSection="'top'"></div>
      <div *negTableOuterSection="'bottom'"></div>
    </pbl-table>
  </div>
</div>

## Top & Bottom sections

The **top** and **bottom** sections is built from 2 sub-sections:

- Fixed meta rows
- Custom Elements

Each section will occupy the height required for it to fully show. (more on this below)

I> All sub-sections are optional, making both sections (**Top** and **Bottom**) optional.

### Fixed meta rows sub-section

Header (top) or Footer (bottom) rows of type **fixed**

Fixed meta rows, will always render right next to border of the **inner section**, respective to their parent section (top/bottom).
Outer elements will come right next to the fixed meta rows.

### Custom elements sub-section

An outlet for custom element driven by templates (`TemplateRef`).  
Examples: Pagination elements, Action rows, etc...

Templates can be added programmatically (`NegTableComponent.createView()` API) or declaratively (`negTableOuterSection` structural directive).

<div fxLayout>
  <div fxFlex="50%">

```html
<pbl-table>
  <!-- Outer Top section -->
    <!-- Custom elements -->
    <!-- Header rows of type fixed -->
  <!-- Outer Top section -->

  <!-- Inner section -->

  <!-- Outer Bottom section -->
    <!-- Footer rows of type fixed -->
    <!-- Custom elements -->
  <!-- Outer Bottom section -->
</pbl-table>
```

  </div>
  <div fxFlex="50%">
    <pbl-table showFooter vScrollNone
              [columns]="{ table: { cols: [ { prop: '__virtual__', label: ' ' } ] } }" [dataSource]="[ {} ]">
      <div *negTableOuterSection="'top'">
        <h1>Outer Top Section</h1>
      </div>
      <div *negTableCellDef="'__virtual__'">
        <h1>Inner Section</h1>
      </div>
      <div *negTableOuterSection="'bottom'">
        <h1>Outer Bottom Section</h1>
      </div>
    </pbl-table>
  </div>
</div>

I> The `negTableOuterSection` directive is a helper that uses the `NegTableComponent.createView()` API internally to provide a declarative interface using templates.

### Fine detailed **Outer Bottom** section

The **Outer Bottom** section is a bit more complex. The **Custom Element** sub section is actually virtual, for simplification.

There are 3 sub-section under the **Custom Element** outlet:

- Before Content (API or `negTableOuterSection`)
- Content (Projected content)
- After Content (API)

To simplify the layout, when `negTableOuterSection` is set to `bottom` it will use the **Before content** section.

To use the **Content** section, is taken from the content inside the host component.
To use the **AfterContent** section you need to use `NegTableComponent.createView()` API.

```html
<pbl-table>
  <!-- Outer Top section -->
  <!-- Inner section -->

  <!-- Outer Bottom section -->
    <!-- Footer rows of type fixed -->
    <!-- Outer elements -->
      <!-- Before content -->
      <!-- Content -->
      <!-- After content -->
    <!-- Outer elements -->
  <!-- Outer Bottom section -->
</pbl-table>
```

<p>You can read more on the programmatic approach, using the API in the <a [routerLink]="['../..', 'stories', 'action-row']">action-row story</a>.</p>

<docsi-mat-example-with-source title="Simple Model" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-table style="height: 110px" [dataSource]="ds" [columns]="columns">
    <div *negTableOuterSection="'top'"></div>
    <div *negTableOuterSection="'bottom'"></div>
  </pbl-table>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

## Data section

The data section contains rows, nothing else. There are 2 types of rows:

- Row/Sticky meta rows
- Data rows

While the **top** and **bottom** sections will occupy the height required for them to fully show, the data section is passive and will
occupy the height of the container minus the height of the other sections.

The actual height assigned to the data section can vary, based on:

- The amount of height occupied by **outer sections**
- The height set to the table component, including the type (% or px)
- Wether virtual scrolling is enabled or disabled

In most cases the auto-assigned height will be fine but in some edge cases it might require some help to get the height right.

<p>To read more on how the height behaves and how to avoid these edge cases see</p>
