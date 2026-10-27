# REQ-SITE-186: Markers guide is a language matrix

## Metadata
- **Status**: COMPLETE
- **Priority**: P0

## Requirement

`/docs/guides/markers` SHALL document RTMX as a multi-language marker system:
universal `rtmx:req` comment form plus a matrix covering every LANG integration
(Go, Python, Rust, JS/TS, Java, Kotlin, Scala, C#, C/C++, Ruby, Swift, Dart,
PHP, Elixir, Julia, Ada, Terraform, MATLAB, R, Perl, Lua, Haskell, Fortran,
COBOL, Verilog, Assembly). It SHALL NOT read as a pytest-only tutorial.

## Acceptance Criteria

1. [x] Page description / lede is language-agnostic.
2. [x] Matrix table lists the languages above with idiomatic markers.
3. [x] Idiomatic examples include at least Go, Python, Rust, JS, Java, C#, C/C++, Ruby.
4. [x] Scanning section uses real `from-tests` flags (`--update`, `--verify`, not invented `--dry-run`/`--report` alone).
5. [x] E2E asserts matrix languages on `/docs/guides/markers`.
