# TODO

- Move this list to *github projects*

- **DOCUMENTATION** - Update / Add documentation where needed

- Support Angular 8 (when released)

- API reference document

- CI/CD integration (including starter app integration on release)

- E2E tests using Cypress

- Add `@pebula/ngrid-bootstrap` based on https://ng-bootstrap.github.io?

- Add pre-built (compiled) css theme file to the release

- Support serialization of column definitions
  - Support save / loan of table column defs

- `@pebula/ngrid-material`
  - Complete cell **view** templates to all types
  - Add cell **edit** templates to all types
  - Add pre-built (compiled) css themes, for each pre-built material theme, to the release

- `@pebula/ngrid/detail-row`
  - Add "mode" feature (click, double click, cellClick cellDoubleClick, manual)
  - Support detail row with virtual scroll

- Aggregation feature
  - Support column aggregation / pivot
  - By type aggregator
  - Custom aggregators

- Virtual Scroll
  - Infinite Scrolling (vis virtual scroll)
  - Horizontal Virtual Scroll

- Performance
  - Refactor column re-ordering logic. Currently re-builds the whole table, need to update viewport only. This is most noticeable when re-ordering and the scroll is deep (e.g. seeing row 300 of 600)

- Development

  - Implement yarn workspaces

  - Implement Auto injected versions (package.json) and smart inter-dependencies between the built packages

  - Demo
    - Show in UX when service worker is building DB
    - Add more stories to the **storied** section
    - Complete the **concepts** section ( see the TODO  at the end of the concepts welcome page)
    - Improve / Add demos for specific features
  
  - Replace demo builder (code extractor webpack integration)
