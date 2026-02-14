const fs = require('fs');
const path = require('path');

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

// 1. Copy processes from root to extension package
const processesSource = path.join(__dirname, '..', '..', '..', 'processes');
const processesDest = path.join(__dirname, '..', 'processes');

console.log('Copying processes to extension package...');
console.log('From:', processesSource);
console.log('To:', processesDest);

// Remove existing if present
if (fs.existsSync(processesDest)) {
  fs.rmSync(processesDest, { recursive: true, force: true });
}

try {
  copyDir(processesSource, processesDest);
  console.log('✓ Processes copied successfully');
} catch (error) {
  console.error('✗ Failed to copy processes:', error);
  process.exit(1);
}

// 2. Copy templates from core to extension package
const templatesSource = path.join(__dirname, '..', '..', 'core', 'templates');
const templatesDest = path.join(__dirname, '..', 'templates');

console.log('Copying templates to extension package...');
console.log('From:', templatesSource);
console.log('To:', templatesDest);

// Remove existing if present
if (fs.existsSync(templatesDest)) {
  fs.rmSync(templatesDest, { recursive: true, force: true });
}

try {
  copyDir(templatesSource, templatesDest);
  console.log('✓ Templates copied successfully');
} catch (error) {
  console.error('✗ Failed to copy templates:', error);
  process.exit(1);
}
