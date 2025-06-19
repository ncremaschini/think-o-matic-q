require('dotenv').config();

// Import the MiroService (we need to handle TypeScript compilation)
const path = require('path');

async function testMiroService() {
  console.log('🧪 Testing MiroService environment loading...');
  
  // Check environment variables directly
  console.log('📋 Environment variables:');
  console.log('- MIRO_ACCESS_TOKEN:', process.env.MIRO_ACCESS_TOKEN ? 'Found' : 'Missing');
  console.log('- MIRO_DEFAULT_WORKSPACE_ID:', process.env.MIRO_DEFAULT_WORKSPACE_ID ? 'Found' : 'Missing');
  console.log('- MIRO_TEMPLATE_BRAINSTORMING:', process.env.MIRO_TEMPLATE_BRAINSTORMING || 'Missing');
  console.log('- MIRO_TEMPLATE_RETROSPECTIVE:', process.env.MIRO_TEMPLATE_RETROSPECTIVE || 'Missing');
  console.log('- MIRO_TEMPLATE_PLANNING:', process.env.MIRO_TEMPLATE_PLANNING || 'Missing');
  
  // Try to require the compiled MiroService
  try {
    const { MiroService } = require('../server/dist/services/miro.js');
    console.log('✅ MiroService loaded successfully');
    
    const miroService = new MiroService();
    console.log('✅ MiroService instantiated successfully');
    
  } catch (error) {
    console.log('❌ Error loading MiroService:', error.message);
    console.log('💡 This might be because the TypeScript isn\'t compiled yet');
  }
}

testMiroService();
