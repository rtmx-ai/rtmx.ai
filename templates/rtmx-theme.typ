// RTMX Typst Theme
// Matches rtmx.ai website dark theme with emerald accent
// Version: 2.0.0

// =============================================================================
// COLOR PALETTE
// =============================================================================

// Primary backgrounds (matching rtmx.ai)
#let bg-primary = rgb("#0a0a0a")      // True black - main background
#let bg-secondary = rgb("#171717")    // Dark gray - cards, nav
#let bg-tertiary = rgb("#262626")     // Lighter gray - code blocks

// Accent colors
#let accent-primary = rgb("#10b981")  // Emerald - main accent
#let accent-light = rgb("#6ee7b7")    // Light emerald - highlights
#let accent-dark = rgb("#064e3b")     // Dark emerald - subtle backgrounds

// Status colors (from favicon/RTM visualization)
#let status-complete = rgb("#22c55e") // Green - complete/success
#let status-partial = rgb("#f59e0b")  // Amber - partial/warning
#let status-missing = rgb("#0ea5e9")  // Sky blue - info/primary bars

// Diagram colors (from hero illustration)
#let color-purple = rgb("#8b5cf6")    // Agent
#let color-yellow = rgb("#f59e0b")    // Requirements
#let color-green = rgb("#10b981")     // Tests
#let color-cyan = rgb("#06b6d4")      // Status

// Text colors
#let text-primary = rgb("#f9fafb")    // Near white - headings
#let text-secondary = rgb("#e5e7eb")  // Light gray - body text
#let text-muted = rgb("#9ca3af")      // Gray - captions, metadata
#let text-dim = rgb("#6b7280")        // Dim gray - subtle text

// Borders and lines
#let border-light = rgb("#262626")
#let border-medium = rgb("#404040")

// Error/danger
#let color-error = rgb("#ef4444")

// =============================================================================
// TYPOGRAPHY
// =============================================================================

// Use system fonts with wide availability
#let font-sans = ("Noto Sans", "DejaVu Sans", "Liberation Sans", "Arial")
#let font-mono = ("Noto Sans Mono", "DejaVu Sans Mono", "Liberation Mono", "Courier New")

// =============================================================================
// RTMX LOGO (Favicon Style)
// =============================================================================

// Recreate the favicon: three vertical bars in a rounded rectangle
#let rtmx-logo(size: 80pt) = {
  let bar-width = size * 0.12
  let bar-gap = size * 0.075
  let total-width = 3 * bar-width + 2 * bar-gap
  let padding = (size - total-width) / 2

  box(
    width: size,
    height: size,
    fill: rgb("#1e293b"),
    radius: size * 0.19,
  )[
    #place(
      dx: padding,
      dy: size * 0.31,
      rect(width: bar-width, height: size * 0.38, fill: status-missing, radius: 2pt)
    )
    #place(
      dx: padding + bar-width + bar-gap,
      dy: size * 0.31,
      rect(width: bar-width, height: size * 0.19, fill: status-complete, radius: 2pt)
    )
    #place(
      dx: padding + bar-width + bar-gap,
      dy: size * 0.56,
      rect(width: bar-width, height: size * 0.12, fill: status-partial, radius: 2pt)
    )
    #place(
      dx: padding + 2 * (bar-width + bar-gap),
      dy: size * 0.31,
      rect(width: bar-width, height: size * 0.38, fill: status-missing, radius: 2pt)
    )
  ]
}

// =============================================================================
// PAGE SETUP
// =============================================================================

#let rtmx-page(
  paper: "a4",
  margin: (x: 2.5cm, top: 3cm, bottom: 2.5cm),
  body,
) = {
  set page(
    paper: paper,
    margin: margin,
    fill: bg-primary,
    header: context {
      if counter(page).get().first() > 1 [
        #set text(size: 9pt, fill: text-muted)
        #h(1fr) RTMX Whitepaper
      ]
    },
    footer: context {
      set text(size: 9pt, fill: text-muted)
      [
        #h(1fr)
        #counter(page).display("1 / 1", both: true)
        #h(1fr)
      ]
    },
  )
  body
}

// =============================================================================
// TEXT STYLES
// =============================================================================

#let rtmx-text() = {
  set text(
    font: font-sans,
    size: 11pt,
    fill: text-secondary,
    lang: "en",
  )
}

#let heading-style() = {
  show heading.where(level: 1): it => {
    set text(size: 24pt, weight: 700, fill: text-primary)
    v(1em)
    it
    v(0.5em)
  }

  show heading.where(level: 2): it => {
    set text(size: 18pt, weight: 600, fill: accent-light)
    v(0.8em)
    it
    v(0.4em)
  }

  show heading.where(level: 3): it => {
    set text(size: 14pt, weight: 600, fill: text-primary)
    v(0.6em)
    it
    v(0.3em)
  }
}

// =============================================================================
// CODE BLOCKS
// =============================================================================

#let code-block(body, lang: none) = {
  block(
    fill: bg-secondary,
    stroke: 1pt + border-light,
    radius: 6pt,
    inset: 12pt,
    width: 100%,
  )[
    #set text(font: font-mono, size: 9pt, fill: text-secondary)
    #if lang != none {
      text(fill: text-muted, size: 8pt)[#lang]
      v(4pt)
    }
    #body
  ]
}

// Inline code
#let rtmx-raw() = {
  show raw.where(block: false): it => {
    box(
      fill: bg-tertiary,
      inset: (x: 4pt, y: 2pt),
      radius: 3pt,
    )[
      #set text(font: font-mono, size: 0.9em, fill: text-secondary)
      #it
    ]
  }

  // Block code also needs styling
  show raw.where(block: true): it => {
    set text(font: font-mono, size: 9pt, fill: text-secondary)
    it
  }
}

// =============================================================================
// COMPONENTS
// =============================================================================

// Callout box - consistent styling without Unicode icons
#let callout(body, type: "info", title: none) = {
  let (bg, accent, label) = if type == "warning" {
    (rgb("#422006"), status-partial, "WARNING")
  } else if type == "error" {
    (rgb("#450a0a"), color-error, "ERROR")
  } else if type == "success" {
    (rgb("#052e16"), status-complete, "SUCCESS")
  } else {
    (accent-dark, accent-primary, "NOTE")
  }

  block(
    fill: bg,
    stroke: (left: 4pt + accent),
    radius: (right: 6pt),
    inset: 14pt,
    width: 100%,
  )[
    #if title != none [
      #text(weight: 700, size: 11pt, fill: accent)[#upper(title)]
      #v(6pt)
    ] else [
      #text(weight: 700, size: 10pt, fill: accent)[#label]
      #v(6pt)
    ]
    #set text(fill: text-secondary, size: 11pt)
    #body
  ]
}

// Table styling
#let rtmx-table() = {
  show table: it => {
    set table(
      stroke: (x, y) => (
        top: if y == 0 { 0pt } else { 1pt + border-light },
        bottom: 1pt + border-light,
        left: 0pt,
        right: 0pt,
      ),
      fill: (x, y) => if y == 0 { bg-secondary } else { none },
    )
    it
  }

  show table.cell: it => {
    if it.y == 0 {
      set text(weight: 600, fill: text-primary)
      it
    } else {
      set text(fill: text-secondary)
      it
    }
  }
}

// Pattern/Anti-pattern comparison - cleaner styling
#let pattern-row(pattern, anti-pattern) = {
  grid(
    columns: (1fr, 1fr),
    gutter: 12pt,
    block(
      fill: rgb("#052e16"),
      stroke: 2pt + status-complete,
      radius: 6pt,
      inset: 12pt,
      width: 100%,
    )[
      #set text(fill: text-secondary, size: 11pt)
      #text(weight: 700, size: 12pt, fill: status-complete)[PATTERN]
      #v(6pt)
      #pattern
    ],
    block(
      fill: rgb("#450a0a"),
      stroke: 2pt + color-error,
      radius: 6pt,
      inset: 12pt,
      width: 100%,
    )[
      #set text(fill: text-secondary, size: 11pt)
      #text(weight: 700, size: 12pt, fill: color-error)[ANTI-PATTERN]
      #v(6pt)
      #anti-pattern
    ],
  )
}

// =============================================================================
// DIAGRAM COMPONENTS (Hero Illustration Style)
// =============================================================================

// Stage box - matches hero illustration cards
#let diagram-box(
  body,
  color: accent-primary,
  width: 140pt,
  height: auto,
) = {
  box(
    width: width,
    height: height,
    fill: bg-secondary,
    stroke: 2pt + color,
    radius: 8pt,
    inset: 12pt,
  )[
    #set text(fill: text-secondary, size: 10pt)
    #body
  ]
}

// Stage label
#let diagram-label(text-content, color: accent-primary) = {
  text(fill: color, size: 14pt, weight: 700)[#text-content]
}

// Arrow connector
#let diagram-arrow(length: 40pt, color: accent-primary) = {
  box(width: length, height: 12pt)[
    #place(
      dy: 5pt,
      line(length: length - 8pt, stroke: 2pt + color)
    )
    #place(
      dx: length - 10pt,
      dy: 2pt,
      polygon(
        fill: color,
        (0pt, 0pt),
        (10pt, 4pt),
        (0pt, 8pt),
      )
    )
  ]
}

// Closed-loop verification diagram
#let closed-loop-diagram() = {
  align(center)[
    #block(
      fill: bg-secondary,
      stroke: 1pt + border-medium,
      radius: 12pt,
      inset: 20pt,
      width: 100%,
    )[
      #set text(fill: text-secondary)

      // Title
      #text(fill: text-primary, size: 14pt, weight: 700)[CLOSED-LOOP VERIFICATION]
      #v(16pt)

      // Flow diagram using grid
      #grid(
        columns: (1fr, auto, 1fr, auto, 1fr, auto, 1fr),
        align: center + horizon,
        gutter: 8pt,

        // Requirements
        box(
          fill: bg-tertiary,
          stroke: 2pt + color-yellow,
          radius: 6pt,
          inset: 10pt,
        )[
          #text(fill: color-yellow, weight: 600, size: 10pt)[Requirements]
        ],

        // Arrow 1
        box(width: 24pt)[
          #text(fill: color-green, size: 14pt)[→]
        ],

        // Tests
        box(
          fill: bg-tertiary,
          stroke: 2pt + color-green,
          radius: 6pt,
          inset: 10pt,
        )[
          #text(fill: color-green, weight: 600, size: 10pt)[Tests]
        ],

        // Arrow 2
        box(width: 24pt)[
          #text(fill: color-cyan, size: 14pt)[→]
        ],

        // Execution
        box(
          fill: bg-tertiary,
          stroke: 2pt + color-cyan,
          radius: 6pt,
          inset: 10pt,
        )[
          #text(fill: color-cyan, weight: 600, size: 10pt)[Execution]
        ],

        // Arrow 3
        box(width: 24pt)[
          #text(fill: color-purple, size: 14pt)[→]
        ],

        // Status
        box(
          fill: bg-tertiary,
          stroke: 2pt + color-purple,
          radius: 6pt,
          inset: 10pt,
        )[
          #text(fill: color-purple, weight: 600, size: 10pt)[Status Update]
        ],
      )

      #v(12pt)

      // Feedback arrow (curved representation)
      #box(
        width: 100%,
        height: 20pt,
      )[
        #place(center + horizon)[
          #text(fill: text-muted, size: 10pt)[↺ Status flows back to inform requirements]
        ]
      ]

      #v(8pt)
      #text(fill: text-muted, size: 10pt, style: "italic")[
        Status reflects reality. Tests are the arbiter of truth.
      ]
    ]
  ]
}

// Agent workflow diagram
#let agent-workflow-diagram() = {
  align(center)[
    #block(
      fill: bg-secondary,
      stroke: 1pt + border-medium,
      radius: 12pt,
      inset: 20pt,
      width: 100%,
    )[
      #text(fill: text-primary, size: 14pt, weight: 700)[AGENT WORKFLOW]
      #v(16pt)

      #grid(
        columns: (auto, auto, 1fr),
        align: left + horizon,
        gutter: (12pt, 8pt),

        box(
          fill: color-purple.lighten(80%),
          stroke: 2pt + color-purple,
          radius: 50%,
          inset: 8pt,
        )[#text(fill: color-purple, weight: 700)[1]],
        text(fill: text-primary, weight: 600)[Read specification],
        text(fill: text-muted, size: 10pt)[docs/requirements/CATEGORY/REQ-XXX.md],

        box(
          fill: color-yellow.lighten(80%),
          stroke: 2pt + color-yellow,
          radius: 50%,
          inset: 8pt,
        )[#text(fill: color-yellow, weight: 700)[2]],
        text(fill: text-primary, weight: 600)[Write tests],
        text(fill: text-muted, size: 10pt)[`@pytest.mark.req("REQ-XXX")`],

        box(
          fill: color-green.lighten(80%),
          stroke: 2pt + color-green,
          radius: 50%,
          inset: 8pt,
        )[#text(fill: color-green, weight: 700)[3]],
        text(fill: text-primary, weight: 600)[Implement code],
        text(fill: text-muted, size: 10pt)[Pass the tests],

        box(
          fill: color-cyan.lighten(80%),
          stroke: 2pt + color-cyan,
          radius: 50%,
          inset: 8pt,
        )[#text(fill: color-cyan, weight: 700)[4]],
        text(fill: text-primary, weight: 600)[Run verification],
        text(fill: text-muted, size: 10pt)[rtmx verify --update],

        box(
          fill: accent-primary.lighten(80%),
          stroke: 2pt + accent-primary,
          radius: 50%,
          inset: 8pt,
        )[#text(fill: accent-primary, weight: 700)[5]],
        text(fill: text-primary, weight: 600)[Commit changes],
        text(fill: text-muted, size: 10pt)[Status already updated by verification],
      )
    ]
  ]
}

// Status transition diagram
#let status-transition-diagram() = {
  align(center)[
    #block(
      fill: bg-secondary,
      stroke: 1pt + border-medium,
      radius: 12pt,
      inset: 20pt,
      width: 100%,
    )[
      #text(fill: text-primary, size: 14pt, weight: 700)[STATUS TRANSITIONS]
      #v(16pt)

      #grid(
        columns: (1fr, auto, 1fr, auto, 1fr),
        align: center + horizon,
        gutter: 6pt,

        // MISSING
        box(
          fill: bg-tertiary,
          stroke: 2pt + status-missing,
          radius: 6pt,
          inset: (x: 12pt, y: 8pt),
        )[
          #text(fill: status-missing, weight: 600, size: 11pt)[MISSING]
          #v(2pt)
          #text(fill: text-muted, size: 8pt)[No tests]
        ],

        text(fill: text-muted, size: 12pt)[→],

        // PARTIAL
        box(
          fill: bg-tertiary,
          stroke: 2pt + status-partial,
          radius: 6pt,
          inset: (x: 12pt, y: 8pt),
        )[
          #text(fill: status-partial, weight: 600, size: 11pt)[PARTIAL]
          #v(2pt)
          #text(fill: text-muted, size: 8pt)[Some pass]
        ],

        text(fill: text-muted, size: 12pt)[→],

        // COMPLETE
        box(
          fill: bg-tertiary,
          stroke: 2pt + status-complete,
          radius: 6pt,
          inset: (x: 12pt, y: 8pt),
        )[
          #text(fill: status-complete, weight: 600, size: 11pt)[COMPLETE]
          #v(2pt)
          #text(fill: text-muted, size: 8pt)[All pass]
        ],
      )

      #v(12pt)
      #text(fill: text-muted, size: 10pt)[
        Regression: COMPLETE → PARTIAL when tests fail
      ]
    ]
  ]
}

// =============================================================================
// TITLE PAGE
// =============================================================================

#let title-page(
  title: "",
  subtitle: none,
  version: none,
  date: none,
  author: "RTMX Engineering",
) = {
  set page(
    fill: bg-primary,
    margin: (x: 2.5cm, y: 3cm),
    header: none,
    footer: none,
  )

  v(3fr)

  // RTMX Logo (favicon style)
  align(center)[
    #rtmx-logo(size: 100pt)
  ]

  v(2em)

  // Title
  align(center)[
    #text(size: 36pt, weight: 700, fill: text-primary)[#title]
  ]

  if subtitle != none {
    v(0.5em)
    align(center)[
      #text(size: 18pt, fill: text-muted)[#subtitle]
    ]
  }

  v(2fr)

  // Metadata
  line(length: 100%, stroke: border-light)
  v(1em)

  grid(
    columns: (1fr, 1fr),
    gutter: 12pt,
    [
      #set text(fill: text-muted, size: 10pt)
      *Author*\
      #text(fill: text-secondary)[#author]
    ],
    [
      #set text(fill: text-muted, size: 10pt)
      #if version != none {
        [*Version*\
        #text(fill: text-secondary)[#version]]
      }
    ],
  )

  if date != none {
    v(0.5em)
    set text(fill: text-muted, size: 10pt)
    [*Date*\
    #text(fill: text-secondary)[#date]]
  }

  v(1em)

  text(size: 9pt, fill: text-dim)[
    rtmx.ai • dev\@rtmx.ai
  ]

  pagebreak()
}

// =============================================================================
// DOCUMENT TEMPLATE
// =============================================================================

#let rtmx-whitepaper(
  title: "RTMX Whitepaper",
  subtitle: none,
  version: "1.0",
  date: datetime.today().display("[month repr:long] [day], [year]"),
  author: "RTMX Engineering",
  body,
) = {
  // Document metadata
  set document(
    title: title,
    author: author,
  )

  // Title page
  title-page(
    title: title,
    subtitle: subtitle,
    version: version,
    date: date,
    author: author,
  )

  // Main content
  rtmx-page()[
    #rtmx-text()
    #heading-style()
    #rtmx-raw()
    #rtmx-table()

    #body
  ]
}
