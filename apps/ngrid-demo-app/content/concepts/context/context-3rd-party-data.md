---
title: Storing 3rd Party Data
path: concepts/context/context-3rd-party-data
parent: concepts/context
tags: context, contextApi
ordinal: 4
---
## Storing 3rd Party Data

nGrid is plugin oriented and plugins might also need a place to store state about columns.

For example, the detail-row plugin stores information about the toggle state of a row (open/close) on the context so when the context comes into view it can
restore the previous state it was in.
