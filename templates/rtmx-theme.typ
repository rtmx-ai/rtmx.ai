// RTMX Typst Theme
// Matches rtmx.ai website dark theme with emerald accent
// Version: 1.0.0

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

// Text colors
#let text-primary = rgb("#f9fafb")    // Near white - headings
#let text-secondary = rgb("#e5e7eb")  // Light gray - body text
#let text-muted = rgb("#9ca3af")      // Gray - captions, metadata
#let text-dim = rgb("#6b7280")        // Dim gray - subtle text

// Borders and lines
#let border-light = rgb("#262626")
#let border-medium = rgb("#404040")

// =============================================================================
// TYPOGRAPHY
// =============================================================================

// Use system fonts with wide availability
#let font-sans = ("Noto Sans", "DejaVu Sans", "Liberation Sans")
#let font-mono = ("Noto Sans Mono", "DejaVu Sans Mono", "Liberation Mono")

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
}

// =============================================================================
// COMPONENTS
// =============================================================================

// Callout box
#let callout(body, type: "info", title: none) = {
  let (bg, accent, icon) = if type == "warning" {
    (rgb("#422006"), status-partial, "⚠")
  } else if type == "error" {
    (rgb("#450a0a"), rgb("#ef4444"), "✗")
  } else if type == "success" {
    (rgb("#052e16"), status-complete, "✓")
  } else {
    (accent-dark, accent-primary, "ℹ")
  }

  block(
    fill: bg,
    stroke: (left: 3pt + accent),
    radius: (right: 4pt),
    inset: 12pt,
    width: 100%,
  )[
    #if title != none [
      #text(weight: 600, fill: accent)[#icon #title]
      #v(4pt)
    ]
    #set text(fill: text-secondary)
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

// Pattern/Anti-pattern comparison
#let pattern-row(pattern, anti-pattern) = {
  grid(
    columns: (1fr, 1fr),
    gutter: 12pt,
    block(
      fill: rgb("#052e16"),
      stroke: 1pt + status-complete,
      radius: 4pt,
      inset: 10pt,
      width: 100%,
    )[
      #set text(fill: text-secondary)
      #text(weight: 600, fill: status-complete)[✓ Pattern]
      #v(4pt)
      #pattern
    ],
    block(
      fill: rgb("#450a0a"),
      stroke: 1pt + rgb("#ef4444"),
      radius: 4pt,
      inset: 10pt,
      width: 100%,
    )[
      #set text(fill: text-secondary)
      #text(weight: 600, fill: rgb("#ef4444"))[✗ Anti-Pattern]
      #v(4pt)
      #anti-pattern
    ],
  )
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

  // Logo placeholder (styled text for now)
  block(
    fill: rgb("#1e293b"),
    radius: 12pt,
    inset: 16pt,
  )[
    #set text(font: font-mono, size: 24pt, weight: 700)
    #text(fill: status-missing)[R]#text(fill: status-complete)[T]#text(fill: status-partial)[M]#text(fill: status-missing)[X]
  ]

  v(2em)

  // Title
  text(size: 32pt, weight: 700, fill: text-primary)[#title]

  if subtitle != none {
    v(0.5em)
    text(size: 16pt, fill: text-muted)[#subtitle]
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
