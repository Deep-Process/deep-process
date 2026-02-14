import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Load a template file from the templates/ directory.
 * Works correctly when running from dist/adapters/ in the published npm package.
 */
export function loadTemplate(filename: string): string {
  // import.meta.url -> file:///path/to/package/dist/adapters/template-loader.js
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.resolve(__dirname, '..', '..', 'templates', filename);
  return fs.readFileSync(templatePath, 'utf-8');
}
