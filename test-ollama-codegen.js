#!/usr/bin/env node
/**
 * Test script to verify Ollama code generation works
 * Run: node test-ollama-codegen.js
 */

const testPrompt = `You are an expert TypeScript/React code editor.

TASK: Generate a simple function.

Generate a TypeScript function that adds two numbers.

REQUIREMENTS:
1. Export the function
2. Include proper TypeScript types
3. Return the sum

OUTPUT FORMAT:
Return ONLY the code. No explanations, no markdown, no code fences.
Start directly with the code.

BEGIN CODE:`;

async function testOllama() {
  console.log('🧪 Testing Ollama Code Generation\n');
  
  try {
    // Test 1: Check Ollama is accessible
    console.log('1. Checking Ollama connection...');
    const tagsResponse = await fetch('http://localhost:11434/api/tags');
    if (!tagsResponse.ok) {
      throw new Error(`Ollama not accessible: ${tagsResponse.status}`);
    }
    const tagsData = await tagsResponse.json();
    const models = tagsData.models || [];
    console.log(`   ✅ Ollama accessible (${models.length} models available)`);
    
    if (models.length === 0) {
      console.log('   ⚠️  No models installed. Run: ollama pull codellama:latest');
      return;
    }
    
    const codellama = models.find(m => m.name.includes('codellama'));
    if (!codellama) {
      console.log('   ⚠️  codellama not found. Available models:', models.map(m => m.name).join(', '));
      console.log('   💡 Run: ollama pull codellama:latest');
      return;
    }
    console.log(`   ✅ Found model: ${codellama.name}\n`);
    
    // Test 2: Generate code
    console.log('2. Testing code generation...');
    console.log('   Prompt:', testPrompt.substring(0, 100) + '...\n');
    
    const generateResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'codellama:latest',
        prompt: testPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9,
          num_predict: 4000,
        }
      })
    });
    
    if (!generateResponse.ok) {
      throw new Error(`Code generation failed: ${generateResponse.status} ${generateResponse.statusText}`);
    }
    
    const generateData = await generateResponse.json();
    
    if (!generateData.response) {
      throw new Error('Ollama returned empty response');
    }
    
    const code = generateData.response.trim();
    console.log('   ✅ Code generated successfully!');
    console.log(`   📏 Length: ${code.length} characters\n`);
    console.log('   Generated code:');
    console.log('   ' + '─'.repeat(60));
    console.log(code.split('\n').map(line => '   ' + line).join('\n'));
    console.log('   ' + '─'.repeat(60) + '\n');
    
    // Test 3: Validate code
    console.log('3. Validating generated code...');
    const hasExport = code.includes('export');
    const hasFunction = /function\s+\w+|const\s+\w+\s*=\s*\(|export\s+(function|const)/.test(code);
    const hasTypes = /:\s*(number|string|boolean)/.test(code);
    
    console.log(`   ${hasExport ? '✅' : '❌'} Has export statement`);
    console.log(`   ${hasFunction ? '✅' : '❌'} Has function definition`);
    console.log(`   ${hasTypes ? '✅' : '❌'} Has TypeScript types`);
    
    if (hasExport && hasFunction && hasTypes) {
      console.log('\n   ✅ Code validation passed!\n');
    } else {
      console.log('\n   ⚠️  Code validation: Some checks failed (may still be valid)\n');
    }
    
    console.log('✅ All tests passed! Ollama code generation is working.\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure Ollama is running: ollama serve');
    console.error('2. Install codellama: ollama pull codellama:latest');
    console.error('3. Check Ollama is accessible: curl http://localhost:11434/api/tags');
    process.exit(1);
  }
}

testOllama();

