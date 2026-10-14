import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Resolve the rtmx CLI checkout used by launch/media e2e.
 * - Standalone rtmx.ai: git submodule at ../../rtmx
 * - Monorepo (system): sibling at ../../../rtmx
 */
export function resolveRtmxRoot(fromUrl = import.meta.url): string {
  const here = path.dirname(fileURLToPath(fromUrl));
  const candidates = [
    path.resolve(here, '../../rtmx'),
    path.resolve(here, '../../../rtmx'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'README.md'))) {
      return candidate;
    }
  }
  return candidates[0];
}
