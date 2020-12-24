---
title: Pagination
path: concepts/datasource/triggers/pagination
parent: concepts/datasource/triggers
ordinal: 1
---
# Pagination

Pagination is a technique we use to split a dataset into chunks, where each chunk is a "page".  
The grid will only render the rows of the page and we can instruct it to move to the previous/next page.

**nGrid** comes with native support for **logical** pagination in 3 flavors:

- Synchronous (client side)
  - Client Side

- Asynchronous (server side)
  - Page number
  - Tokens

I> **Logical Pagination**  
By **logical** we mean that **pagination** is a feature provided by the datasource, it does not care or knows about UI.  
**Pagination** provides a method to "move" to the next page or query if there is a next page, that is it.  
Elsewhere, A UI *plugin* might use the above and bind it to a button while implementing some form of UI (i.e. Material, Bootstrap...)

## Synchronous/Client-Side Pagination

Client side pagination is applied when the entire datasource is available offline or fetched once from the server.

In this scenario the entire logic is handled automatically by datasource, based on pagination configuration input.  
For example, setting the page size to 50 will create pages with 50 rows (max) each. If the dataset is 1000 we will have 20 pages.

## Asynchronous (server side)

Server side pagination is applied when the datasource is fetched in chunks, only portions of it are fetched each time.
For example, if the entire dataset is 1 million records we might want to fetch 20, 50 or 100 at a time.

In this mode the developer must provide the data when a page has changed, this is because it requires a call to the server.  
**nGrid** will invoke the `onTrigger` handler with an event object that indicates that the source of the trigger was a pagination
request to fetch a new "page" including metadata required for the operation (e.g. the page number to fetch).

There are 2 types of server side paging which **nGrid** provides support for:

### Page Number based

Page Number pagination is used when the server supports returning a page directly, using the page number.  
This is possible when the server knows the total amount of rows and can extract specific sections from the dataset.

There are 2 common forms servers might expect:

- Getting the total number of rows per page and the page number
- Getting the row number to start from and the row number to stop at (SKIP & LIMIT)

Regardless, it is the same information, transforming from one method to the other is simple math.

### Token based

Token pagination is used when the server does not support direct page fetching.  
Usually, the server accepts an initial request with the number of rows per page to fetch and from there on
it will use a token as a reference to the **next** page only.

Usually, with this approach the total amount of rows/pages is unknown.

> These are the 2 most commonly used types, you can provide your own logical unit if you need a unique implementation.

The plugins [@pebula/ngrid-material/paginator](../../../../plugins/ngrid-material/pagination) and [@pebula/ngrid-bootstrap/pagination](../../../../plugins/ngrid-bootstrap/pagination) are using the pagination logic to implement pagination UI controls.
