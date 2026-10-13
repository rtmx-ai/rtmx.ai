import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * REQ-SITE-028: Show HN launch media assets (Mermaid + vhs) live in the
 * rtmx CLI docs tree and are verified from the monorepo checkout.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const rtmxDocs = path.resolve(here, '../../../rtmx/docs');

const DIAGRAMS = [
  'dev-loop.mmd',
  'csv-diff.mmd',
  'mcp-architecture.mmd',
  'requirement-lifecycle.mmd',
];

const TAPES = ['workflow.tape', 'agent-loop.tape'];

const GIFS = ['rtmx-workflow.gif', 'rtmx-agent-loop.gif'];

const SCREENSHOTS = ['rtmx-status.png', 'rtmx-backlog.png', 'rtmx-health.png'];

/** Emerald palette tokens used across launch diagrams (SITE-028f). */
const EMERALD_TOKENS = ['#059669', '#10b981', '#6ee7b7', '#d1fae5', '#065f46'];

test.describe('Show HN launch media assets (SITE-028)', () => {
  test('all four Mermaid diagrams exist (SITE-028a)', async () => {
    for (const name of DIAGRAMS) {
      const p = path.join(rtmxDocs, 'diagrams', name);
      expect(fs.existsSync(p), `missing ${p}`).toBeTruthy();
      expect(fs.statSync(p).size).toBeGreaterThan(50);
    }
  });

  test('Mermaid sources are valid flowchart/state diagrams (SITE-028b)', async () => {
    for (const name of DIAGRAMS) {
      const body = fs.readFileSync(path.join(rtmxDocs, 'diagrams', name), 'utf8');
      expect(
        /^(flowchart|stateDiagram|graph|block-beta)\b/m.test(body),
        `${name} should declare a Mermaid diagram type`,
      ).toBeTruthy();
    }
  });

  test('vhs tape files exist for workflow and agent-loop (SITE-028c)', async () => {
    for (const name of TAPES) {
      const p = path.join(rtmxDocs, 'tapes', name);
      expect(fs.existsSync(p), `missing ${p}`).toBeTruthy();
      const body = fs.readFileSync(p, 'utf8');
      expect(body).toMatch(/^Output\s+docs\/assets\//m);
    }
  });

  test('generated GIFs exist in docs/assets (SITE-028d)', async () => {
    for (const name of GIFS) {
      const p = path.join(rtmxDocs, 'assets', name);
      expect(fs.existsSync(p), `missing ${p}`).toBeTruthy();
      expect(fs.statSync(p).size).toBeGreaterThan(10_000);
    }
  });

  test('terminal screenshots exist against dogfooded DB (SITE-028e)', async () => {
    for (const name of SCREENSHOTS) {
      const p = path.join(rtmxDocs, 'assets', name);
      expect(fs.existsSync(p), `missing ${p}`).toBeTruthy();
      expect(fs.statSync(p).size).toBeGreaterThan(5_000);
    }
    // Tape header documents dogfooding on the full RTM, not a 12-req demo.
    const tape = fs.readFileSync(path.join(rtmxDocs, 'tapes', 'workflow.tape'), 'utf8');
    expect(tape.toLowerCase()).toMatch(/dogfood|requirement/);
  });

  test('diagrams use rtmx.ai emerald palette (SITE-028f)', async () => {
    for (const name of DIAGRAMS) {
      const body = fs.readFileSync(path.join(rtmxDocs, 'diagrams', name), 'utf8');
      const hit = EMERALD_TOKENS.some((t) => body.toLowerCase().includes(t.toLowerCase()));
      expect(hit, `${name} should include an emerald palette token`).toBeTruthy();
    }
  });
});
