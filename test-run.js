/**
 * Test runner dla deep-process
 * Uruchamia przykładowy proces bez instalacji
 */

import { executeWorkflow, loadAllManifests, initializeProvider } from './packages/core/dist/index.js';

async function runExample() {
  console.log('🚀 Deep Process Test Runner\n');

  try {
    // 1. Załaduj manifesty procesów
    console.log('📦 Loading process manifests...');
    const manifests = await loadAllManifests();
    console.log(`   Found ${manifests.length} processes\n`);

    // 2. Wybierz proces (deep-verify jako przykład)
    const processId = 'deep-verify';
    const manifest = manifests.find(m => m.id === processId);

    if (!manifest) {
      throw new Error(`Process ${processId} not found`);
    }

    console.log(`✅ Selected process: ${manifest.name}`);
    console.log(`   Description: ${manifest.description}\n`);

    // 3. Zainicjuj LLM provider (wymaga API key)
    console.log('🤖 Initializing LLM provider...');
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('❌ Error: No API key found!');
      console.error('   Set ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable');
      process.exit(1);
    }

    const provider = await initializeProvider({
      type: process.env.ANTHROPIC_API_KEY ? 'anthropic' : 'openai',
      defaultModel: process.env.ANTHROPIC_API_KEY ? 'claude-3-5-sonnet-20241022' : 'gpt-4o',
      apiKey: apiKey,
    });

    console.log(`   Provider: ${provider.displayName}\n`);

    // 4. Przygotuj kontekst wykonania
    const context = {
      processId: manifest.id,
      processDir: `processes/${manifest.id}`,
      userInput: `
Verify the following code is correct:

\`\`\`javascript
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}
\`\`\`

Check for:
- Logic errors
- Off-by-one errors
- Edge cases
      `.trim(),
      depth: 'quick', // quick | standard | comprehensive | critical
      crisisMode: false,
    };

    console.log('📝 User Input:');
    console.log(context.userInput);
    console.log('\n' + '='.repeat(80) + '\n');

    // 5. Wykonaj workflow
    console.log('⚙️  Executing workflow...\n');

    const result = await executeWorkflow(manifest, context, provider, {
      onStepStart: (stepId, stepName) => {
        console.log(`\n🔹 Step: ${stepName}`);
      },
      onStepComplete: (stepResult) => {
        const status = stepResult.success ? '✅' : '❌';
        console.log(`   ${status} Completed in ${stepResult.executionTime}ms`);

        if (stepResult.gateResult) {
          const gateStatus = stepResult.gateResult.passed ? '✅ OPEN' : '❌ LOCKED';
          console.log(`   Gate: ${stepResult.gateResult.name} - ${gateStatus}`);
        }
      },
      onGateEvaluation: (gateResult) => {
        if (gateResult.failureReasons.length > 0) {
          console.log(`   ⚠️  Gate issues:`);
          gateResult.failureReasons.forEach(reason => {
            console.log(`      - ${reason}`);
          });
        }
      },
    });

    // 6. Pokaż wyniki
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 RESULTS\n');

    if (result.success) {
      console.log('✅ Execution successful!');
      console.log(`   Total time: ${result.totalExecutionTime}ms`);
      console.log(`   Steps completed: ${result.steps.length}`);

      console.log('\n📄 Final Output:');
      console.log(result.finalOutput);

      // Zapisz artifacts
      if (result.allCollectedData.length > 0) {
        console.log('\n💾 Artifacts collected:');
        result.allCollectedData.forEach((data, i) => {
          if (Object.keys(data.yaml).length > 0) {
            console.log(`   Step ${i + 1}:`);
            Object.keys(data.yaml).forEach(key => {
              console.log(`      - ${key}.yaml`);
            });
          }
        });
      }
    } else {
      console.log('❌ Execution failed!');
      console.log(`   Error: ${result.error}`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Uruchom
runExample();
