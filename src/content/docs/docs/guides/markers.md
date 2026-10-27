---
title: Test Markers
description: Language matrix for linking tests to requirements across every stack RTMX scans
---

Requirement IDs are the shared object. Markers attach those IDs to tests in each
language’s native idiom so `rtmx from-tests` / `rtmx verify` can close the loop
whether the suite is pytest, `go test`, `cargo test`, Jest, JUnit, or firmware
comment markers. That is what makes polyglot verification useful with Sync:
heterogeneous agents claim the same `REQ-*` while verifying in their own toolchain.

## Universal comment (works everywhere)

If you are unsure which idiom to use, put a comment next to the test:

```text
// rtmx:req REQ-AUTH-001
# rtmx:req REQ-AUTH-001
-- rtmx:req REQ-AUTH-001
; rtmx:req REQ-AUTH-001
% rtmx:req REQ-AUTH-001
* rtmx:req REQ-AUTH-001
```

The scanner accepts the comment form that matches the file’s comment syntax.
The ID must match a row in your RTM database (`REQ-[A-Z]+-[0-9]+`).

## Language matrix

Primary styles scanned by `rtmx from-tests` (REQ-LANG-003 … REQ-LANG-029):

| Language | Typical runner | Idiomatic marker | Also accepts |
|----------|----------------|------------------|--------------|
| **Go** | `go test` | `rtmx.Req(t, "REQ-ID")` | `// rtmx:req` |
| **Python** | pytest | `@pytest.mark.req("REQ-ID")` | `//` / `#` comment form |
| **Rust** | `cargo test` | `#[req("REQ-ID")]` | `rtmx::req("REQ-ID")`, `// rtmx:req` |
| **JavaScript / TypeScript** | Jest, Vitest, Mocha | `req("REQ-ID")` / `rtmx.req("REQ-ID")` | `describe.rtmx("REQ-ID", …)`, `// rtmx:req` |
| **Java** | JUnit 5 / Maven | `@Req("REQ-ID")` | `// rtmx:req` |
| **Kotlin** | Kotest / Gradle | `@Req("REQ-ID")` | `// rtmx:req` |
| **Scala** | ScalaTest / MUnit | `@req("REQ-ID")` | `// rtmx:req` |
| **C#** | xUnit / NUnit / MSTest | `[Req("REQ-ID")]` | `// rtmx:req` |
| **C / C++** | GoogleTest / Catch2 | `RTMX_REQ("REQ-ID")` | `// rtmx:req` |
| **Ruby** | RSpec / Minitest | `it "…", req: "REQ-ID"` | `# rtmx:req` |
| **Swift** | XCTest | `@Req("REQ-ID")` | `// rtmx:req` |
| **Dart / Flutter** | `dart test` | `req("REQ-ID")` | `// rtmx:req` |
| **PHP** | PHPUnit / Pest | `@req("REQ-ID")` (docblock) | `// rtmx:req` |
| **Elixir** | ExUnit | `@tag req: "REQ-ID"` | `# rtmx:req` |
| **Julia** | `Pkg.test` | `@req("REQ-ID")` | `# rtmx:req` |
| **Ada / SPARK** | AUnit | `pragma Req("REQ-ID")` | `-- rtmx:req` |
| **Terraform** | `terraform test` | `labels = { req = "REQ-ID" }` | `# rtmx:req` in `.tftest.hcl` |
| **MATLAB** | `matlab.unittest` | `% rtmx:req REQ-ID` | — |
| **R** | testthat | `# rtmx:req REQ-ID` | — |
| **Perl** | Test::More / prove | `# rtmx:req REQ-ID` | — |
| **Lua** | busted / luaunit | `-- rtmx:req REQ-ID` | — |
| **Haskell** | HSpec / Tasty | `-- rtmx:req REQ-ID` | — |
| **Fortran** | pFUnit | `! rtmx:req REQ-ID` | — |
| **COBOL** | GnuCOBOL / Micro Focus | `*> rtmx:req REQ-ID` | `* rtmx:req` (fixed format) |
| **Verilog / SystemVerilog** | UVM / sim | `// rtmx:req REQ-ID` | — |
| **Assembly** | bare-metal / firmware | `; rtmx:req REQ-ID` | — |

Scan any tree; RTMX dispatches by file type. Mixed-language monorepos are normal.

## Idiomatic examples

### Go

```go
func TestOAuthLogin(t *testing.T) {
    rtmx.Req(t, "REQ-AUTH-001")
    // …
}
```

### Python (pytest)

```python
@pytest.mark.req("REQ-AUTH-001")
@pytest.mark.scope_unit
def test_oauth_login():
    assert authenticate_user(token) == expected_user
```

### Rust

```rust
#[req("REQ-AUTH-001")]
#[test]
fn oauth_login() {
    // …
}
```

### JavaScript / TypeScript

```js
test("oauth login", () => {
  req("REQ-AUTH-001");
  // …
});
```

### Java

```java
@Test
@Req("REQ-AUTH-001")
void oauthLogin() {
    // …
}
```

### C#

```csharp
[Fact]
[Req("REQ-AUTH-001")]
public void OAuthLogin() {
    // …
}
```

### C / C++

```cpp
TEST(Auth, OAuthLogin) {
    RTMX_REQ("REQ-AUTH-001");
    // …
}
```

### Ruby (RSpec)

```ruby
it "oauth login", req: "REQ-AUTH-001" do
  # …
end
```

## Dimensional markers (scope / technique / env)

Optional dimensions enrich reporting. pytest exposes them as first-class marks;
other languages often fold them into attributes or comments.

| Dimension | Values (examples) | pytest |
|-----------|-------------------|--------|
| **scope** | `unit`, `integration`, `system`, `e2e` | `@pytest.mark.scope_unit` |
| **technique** | `nominal`, `parametric`, `monte_carlo`, `stress` | `@pytest.mark.technique_nominal` |
| **env** | `simulation`, `hil`, `anechoic`, `field` | `@pytest.mark.env_simulation` |

Rust example with dimensions:

```rust
#[req("REQ-AUTH-002", scope = "integration", technique = "boundary")]
#[test]
fn oauth_boundary() {}
```

Python-only registration (optional):

```yaml
# rtmx.yaml
rtmx:
  pytest:
    marker_prefix: "req"
    register_markers: true
```

```toml
# pyproject.toml
[tool.pytest.ini_options]
markers = [
    "req(id): Link test to requirement",
    "scope_unit: Unit test scope",
    "scope_integration: Integration test scope",
    "scope_system: System test scope",
]
```

## Scanning and verifying

```bash
rtmx from-tests                 # Scan current / tests path
rtmx from-tests src/            # Or a language workspace
rtmx from-tests --show-all      # List every marker found
rtmx from-tests --show-missing  # IDs not in the RTM yet
rtmx from-tests --update        # Write test linkage into the RTM
rtmx from-tests --update --verify   # Link + run tests + update status
```

`rtmx markers` discovers the same language-agnostic annotations for inspection.

## Best practices

1. **One shared ID** — `REQ-AUTH-001` in Go and in Jest is the same requirement; that is the multiplayer seam.
2. **At least one test per requirement** — happy path and failure path can share an ID.
3. **Prefer idiomatic markers** when your stack has them; fall back to `rtmx:req` comments otherwise.
4. **Keep IDs stable** — renaming a requirement breaks linkage across every language that references it.

## CI

```bash
# Language-agnostic: scan + fail if linkage drifts
rtmx from-tests --update --verify

# Python suites that register marks strictly
pytest --strict-markers
```
