require('dotenv').config();
const axios = require('axios');

async function validateTemplate() {
  console.log('🧪 Validating template board...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const templateId = process.env.MIRO_TEMPLATE_BRAINSTORMING; // Should be 'uXjVI1oEMo0='
  
  console.log('📋 Template ID:', templateId);
  
  try {
    // Check if template board exists and get its info
    console.log('🔍 Checking template board...');
    const boardResponse = await axios.get(
      `https://api.miro.com/v2/boards/${templateId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    console.log('✅ Template board found:');
    console.log('- Name:', boardResponse.data.name);
    console.log('- Description:', boardResponse.data.description);
    console.log('- URL:', boardResponse.data.viewLink);
    
    // Check what items are in the template
    console.log('\n🔍 Checking template content...');
    const itemsResponse = await axios.get(
      `https://api.miro.com/v2/boards/${templateId}/items`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    const items = itemsResponse.data.data || [];
    console.log('📋 Template contains', items.length, 'items:');
    
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.type}: ${item.data?.content || item.data?.text || 'No content'}`);
    });
    
    if (items.length === 0) {
      console.log('⚠️  Template board is empty! This explains why copying doesn\'t work.');
    }
    
    return items.length > 0;
    
  } catch (error) {
    console.error('❌ Error validating template:', error.response?.data || error.message);
    return false;
  }
}

validateTemplate().then(hasContent => {
  if (hasContent) {
    console.log('\n✅ Template has content - copying should work');
  } else {
    console.log('\n❌ Template is empty or inaccessible - need to use a different template');
  }
});
