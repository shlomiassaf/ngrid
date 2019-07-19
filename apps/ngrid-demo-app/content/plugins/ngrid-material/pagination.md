---
title: Pagination
path: plugins/ngrid-material/pagination
parent: plugins/ngrid-material
ordinal: 3
---
# Pagination

The table comes with native support for **logical** pagination in 3 flavors:

- Synchronous (client side)
  - Client Side

- Asynchronous (server side)
  - Page number
  - Tokens

## Logical Pagination

Logical pagination means that the table does not include any concrete UI implementation, this is provided by plugins.
In the following examples we use the `@pebula/ngrid/mat-paginator" which is a  paginator based on the Material Design spec.

In fact, pagination itself is a native datasource feature and the table does not handle any logic, only the datasource.

## Synchronous/Client-Side Pagination

Client side pagination is applied when the entire datasource is available offline or fetched once from the server.

In this scenario the entire process is handled automatically by the table, based on external configuration input.

<div pbl-example-view="pbl-pagination-example"></div>

Changing the current pages done synchronously because the data exists.

## Asynchronous (server side)

Server side pagination is applied when the datasource is incomplete, only portions of it are fetched each time.
For example, if the entire record-set is 1 million records we might want to fetch 20, 50 or 100 at a time.

In this mode the developer must provide the data when a page has changed, this is because it requires a call to the server.

### Page number

Page number pagination is applied when the server expects metadata that describe the boundaries of the data we want.
For example, the server might expect the total numbers of rows per page and the page we want or the number of rows to
SKIP and the number or rows to TAKE.

Regardless, it is the same information, transforming from one method to the other is simple math.

<div pbl-example-view="pbl-async-page-number-example"></div>

### Tokens

Token pagination is applied when the server expects an initial request with metadata the describes the boundaries of the data we want.
From that point, the response is the data set with an additional token that we can use to get the next page.

With this method might be missing the total amount of rows/pages depending on the implementation.

<div pbl-example-view="pbl-async-token-example"></div>
