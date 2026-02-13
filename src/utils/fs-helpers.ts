import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Normalize path separators to forward slashes for cross-platform config storage.
 */
export function toPosixPath(p: string): string {
  return p.replace(/\\/g, '/');
}

/**
 * Ensure a directory exists, creating it recursively if needed.
 */
export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Safely write a file, creating parent directories as needed.
 */
export function safeWriteFile(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Check if a file exists.
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Compute a SHA-256 hash of file contents.
 */
export function hashFile(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

/**
 * Remove a file if it exists.
 */
export function safeRemoveFile(filePath: string): boolean {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

/**
 * Remove a directory and clean up empty parent directories.
 */
export function safeRemoveDir(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

/**
 * Add a line to .gitignore if not already present.
 */
export function addToGitignore(projectRoot: string, entry: string): boolean {
  const gitignorePath = path.join(projectRoot, '.gitignore');
  let content = '';

  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf-8');
    if (content.split('\n').some(line => line.trim() === entry)) {
      return false; // Already present
    }
  }

  const separator = content.endsWith('\n') || content === '' ? '' : '\n';
  fs.writeFileSync(gitignorePath, content + separator + entry + '\n', 'utf-8');
  return true;
}

/**
 * Insert or replace content between markers in a file.
 */
export function markerReplace(
  filePath: string,
  startMarker: string,
  endMarker: string,
  content: string
): void {
  let existing = '';
  if (fs.existsSync(filePath)) {
    existing = fs.readFileSync(filePath, 'utf-8');
  }

  const startIdx = existing.indexOf(startMarker);
  const endIdx = existing.indexOf(endMarker);

  const block = `${startMarker}\n${content}\n${endMarker}`;

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing block
    const before = existing.slice(0, startIdx);
    const after = existing.slice(endIdx + endMarker.length);
    safeWriteFile(filePath, before + block + after);
  } else {
    // Append
    const separator = existing.endsWith('\n') || existing === '' ? '' : '\n';
    safeWriteFile(filePath, existing + separator + '\n' + block + '\n');
  }
}

/**
 * Remove content between markers in a file.
 */
export function markerRemove(filePath: string, startMarker: string, endMarker: string): boolean {
  if (!fs.existsSync(filePath)) return false;

  const content = fs.readFileSync(filePath, 'utf-8');
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) return false;

  // Remove the block including surrounding blank lines
  let before = content.slice(0, startIdx).replace(/\n+$/, '\n');
  const after = content.slice(endIdx + endMarker.length).replace(/^\n+/, '\n');
  const result = before + after;

  fs.writeFileSync(filePath, result.trim() + '\n', 'utf-8');
  return true;
}
