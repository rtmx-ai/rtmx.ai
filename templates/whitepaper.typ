// RTMX Whitepaper Template
//
// Usage:
//   typst compile --root .. whitepaper.typ output.pdf
//
// Or from the rtmx.ai root:
//   typst compile --root . whitepapers/your-whitepaper.typ whitepapers/output.pdf
//
// This file serves as documentation for the template system.
// See whitepapers/rtmx-101.typ for a complete example.

#import "rtmx-theme.typ": *

// =============================================================================
// AVAILABLE COMPONENTS
// =============================================================================
//
// Document wrapper:
//   #show: rtmx-whitepaper.with(
//     title: "Title",
//     subtitle: "Subtitle",     // optional
//     version: "1.0",
//     author: "RTMX Engineering",
//   )
//
// Callout boxes:
//   #callout(type: "info", title: "Note")[Content]
//   #callout(type: "warning", title: "Warning")[Content]
//   #callout(type: "success", title: "Success")[Content]
//   #callout(type: "error", title: "Error")[Content]
//
// Code blocks:
//   #code-block(lang: "python")[
//     ```python
//     print("hello")
//     ```
//   ]
//
// Pattern/Anti-pattern comparison:
//   #pattern-row(
//     [Pattern description],
//     [Anti-pattern description],
//   )
//
// Colors (from rtmx-theme.typ):
//   bg-primary, bg-secondary, bg-tertiary
//   accent-primary, accent-light, accent-dark
//   status-complete, status-partial, status-missing
//   text-primary, text-secondary, text-muted, text-dim
//
// =============================================================================

#show: rtmx-whitepaper.with(
  title: "Template Reference",
  subtitle: "RTMX Whitepaper Template Documentation",
  version: "1.0",
  author: "RTMX Engineering",
)

= Overview

This document demonstrates the RTMX whitepaper template components. Use this as a reference when creating new whitepapers.

= Callouts

#callout(type: "info", title: "Info")[Informational callout for general notes.]

#callout(type: "success", title: "Success")[Success callout for positive outcomes.]

#callout(type: "warning", title: "Warning")[Warning callout for cautions.]

= Code Blocks

#code-block(lang: "bash")[
  ```bash
  rtmx verify --update
  ```
]

= Pattern Comparison

#pattern-row(
  [Use `rtmx verify --update`],
  [Manual status edits],
)
