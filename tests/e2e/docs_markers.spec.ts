import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * REQ-SITE-186: Markers guide is a language matrix, not a pytest tutorial.
 */

const MATRIX_LANGS = [
  'Go',
  'Python',
  'Rust',
  'JavaScript',
  'Java',
  'Kotlin',
  'Scala',
  'C#',
  'C / C++',
  'Ruby',
  'Swift',
  'Dart',
  'PHP',
  'Elixir',
  'Julia',
  'Ada',
  'Terraform',
  'MATLAB',
  'R',
  'Perl',
  'Lua',
  'Haskell',
  'Fortran',
  'COBOL',
  'Verilog',
  'Assembly',
];

test.describe('markers guide language matrix (SITE-186)', () => {
  test('source is a matrix, not pytest-only', () => {
    const md = fs.readFileSync(
      path.join(process.cwd(), 'src/content/docs/docs/guides/markers.md'),
      'utf8',
    );
    expect(md.toLowerCase()).toContain('language matrix');
    expect(md).toMatch(/rtmx:req/);
    expect(md).not.toMatch(/^description: Link pytest tests/m);
    for (const lang of MATRIX_LANGS) {
      expect(md, `missing ${lang}`).toContain(lang);
    }
    expect(md).toContain('rtmx.Req(t');
    expect(md).toContain('@pytest.mark.req');
    expect(md).toContain('#[req(');
    expect(md).toContain('RTMX_REQ(');
    expect(md).toContain('from-tests --update --verify');
    expect(md).not.toContain('from-tests --dry-run');
    expect(md).not.toContain('from-tests --report');
  });

  test('page renders matrix languages', async ({ page }) => {
    const resp = await page.goto('/docs/guides/markers');
    expect(resp?.status()).toBe(200);
    const main = page.locator('main');
    await expect(main).toContainText(/Language matrix/i);
    await expect(main).toContainText(/rtmx:req/);
    await expect(main).toContainText('Go');
    await expect(main).toContainText('Rust');
    await expect(main).toContainText('Assembly');
    await expect(main).toContainText('COBOL');
    await expect(main).not.toContainText(/RTMX provides pytest markers to link tests directly/);
  });
});
