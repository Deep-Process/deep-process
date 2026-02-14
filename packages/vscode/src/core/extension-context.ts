/**
 * Extension context singleton - stores the extension path set during activation.
 * This is needed because import.meta.url doesn't work in esbuild bundles.
 */
let extensionPath: string | undefined;

export function setExtensionPath(path: string): void {
  extensionPath = path;
}

export function getExtensionPath(): string {
  if (!extensionPath) {
    throw new Error('Extension path not initialized. Call setExtensionPath() in activate() first.');
  }
  return extensionPath;
}
