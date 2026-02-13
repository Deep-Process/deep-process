const fs = require('fs');
const path = require('path');

// Copy processes from root to extension package
const source = path.join(__dirname, '..', '..', '..', 'processes');
const dest = path.join(__dirname, '..', 'processes');

console.log('Copying processes to extension package...');
console.log('From:', source);
console.log('To:', dest);

// Remove existing if present
if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}

// Copy directory recursively
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

try {
  copyDir(source, dest);
  console.log('✓ Processes copied successfully');
} catch (error) {
  console.error('✗ Failed to copy processes:', error);
  process.exit(1);
}
