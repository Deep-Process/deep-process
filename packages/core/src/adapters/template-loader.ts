import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Global template base path - can be set by VS Code extension or other bundled contexts.
 * If not set, will use import.meta.url to resolve the path.
 */
let globalTemplateBasePath: string | undefined;

/**
 * Set the base path for templates. This is needed for bundled contexts like VS Code
 * where import.meta.url is not available.
 */
export function setTemplateBasePath(basePath: string): void {
  globalTemplateBasePath = basePath;
}

/**
 * Load a template file from the templates/ directory.
 * Works correctly when running from dist/adapters/ in the published npm package.
 * Also works in bundled contexts (like VS Code) when setTemplateBasePath() is called first.
 */
export function loadTemplate(filename: string): string {
  let templatePath: string;

  if (globalTemplateBasePath) {
    // Use the globally set base path (for VS Code bundled extension)
    templatePath = path.join(globalTemplateBasePath, 'templates', filename);
  } else if (import.meta.url) {
    // Use import.meta.url (for Node.js CLI and unbundled contexts)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    templatePath = path.resolve(__dirname, '..', '..', 'templates', filename);
  } else {
    throw new Error(
      'Template loader not initialized. Call setTemplateBasePath() before using adapters in bundled contexts.'
    );
  }

  return fs.readFileSync(templatePath, 'utf-8');
}
