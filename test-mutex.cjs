/**
 * Test script to verify config mutex works correctly
 * Simulates concurrent config updates from multiple "processes"
 */

const path = require('path');
const fs = require('fs');

// Mock project structure
const testDir = path.join(__dirname, 'test-workspace');
const configDir = path.join(testDir, '_deep-process');
const configPath = path.join(configDir, 'deep-process.config.yaml');

// Setup
function setup() {
  console.log('🔧 Setting up test workspace...');

  // Clean up if exists
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }

  // Create structure
  fs.mkdirSync(configDir, { recursive: true });

  // Create initial config
  const initialConfig = `version: "1.0.0"
packageVersion: "1.0.0"
installation:
  scope: project
  processDir: _deep-process
processes: {}
tools: {}
`;

  fs.writeFileSync(configPath, initialConfig, 'utf-8');
  console.log('✅ Test workspace created');
}

// Import after setup
setup();

// Now import the config manager
const { updateConfig } = require('./packages/core/dist/config-manager.js');

// Test concurrent updates
async function testConcurrentUpdates() {
  console.log('\n🧪 Testing concurrent config updates...\n');

  const operations = [];
  const operationCount = 5;

  // Simulate 5 concurrent operations
  for (let i = 0; i < operationCount; i++) {
    const operation = updateConfig(testDir, (config) => {
      const toolId = `tool-${i}`;
      console.log(`  [${i}] Updating config - adding ${toolId}`);

      // Simulate some work
      const start = Date.now();
      while (Date.now() - start < 50) {} // 50ms busy wait

      config.tools[toolId] = {
        enabled: true,
        files: [`${toolId}.md`]
      };

      console.log(`  [${i}] ✓ Update complete`);
      return config;
    }).catch(err => {
      console.error(`  [${i}] ❌ Error:`, err.message);
      throw err;
    });

    operations.push(operation);
  }

  // Wait for all operations
  console.log('\n⏳ Waiting for all operations to complete...\n');
  await Promise.all(operations);

  console.log('✅ All operations completed\n');
}

// Verify results
function verifyResults() {
  console.log('🔍 Verifying results...\n');

  const config = fs.readFileSync(configPath, 'utf-8');
  console.log('Final config:');
  console.log(config);

  // Check if all tools were added
  const toolCount = (config.match(/tool-\d+:/g) || []).length;
  console.log(`\n📊 Tools added: ${toolCount}/5`);

  if (toolCount === 5) {
    console.log('✅ SUCCESS: All tools present - mutex worked correctly!');
    return true;
  } else {
    console.log('❌ FAILURE: Some tools missing - data loss detected!');
    return false;
  }
}

// Cleanup
function cleanup() {
  console.log('\n🧹 Cleaning up...');
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
  console.log('✅ Cleanup complete\n');
}

// Run test
async function runTest() {
  try {
    await testConcurrentUpdates();
    const success = verifyResults();
    cleanup();

    console.log('\n' + '='.repeat(50));
    if (success) {
      console.log('✅ TEST PASSED: Mutex correctly prevents race conditions');
    } else {
      console.log('❌ TEST FAILED: Race condition detected');
      process.exit(1);
    }
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    cleanup();
    process.exit(1);
  }
}

runTest();
