require('dotenv').config();
const axios = require('axios');

async function testTemplateDuplicate() {
  console.log('🧪 Testing Miro template duplication...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const templateId = process.env.MIRO_TEMPLATE_BRAINSTORMING; // Should be 'uXjVI1oEMo0='
  
  console.log('📋 Template ID:', templateId);
  console.log('🔑 Access token:', accessToken ? 'Found' : 'Missing');
  
  try {
    // Try to duplicate the template board directly
    console.log('🔄 Duplicating template board...');
    
    const duplicateResponse = await axios.post(
      `https://api.miro.com/v2/boards`,
      {
        name: 'Workshop from Template - ' + new Date().toISOString(),
        description: 'Board created from brainstorming template',
        copyFrom: templateId
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Template duplicated successfully!');
    console.log('📋 New board ID:', duplicateResponse.data.id);
    console.log('🔗 New board URL:', duplicateResponse.data.viewLink);
    
    return duplicateResponse.data.id;
    
  } catch (error) {
    console.log('❌ Template duplication failed:', error.response?.data || error.message);
    
    // Fallback: try to get items from template and copy them
    console.log('🔄 Trying alternative approach: copying items...');
    
    try {
      // First create empty board
      const boardResponse = await axios.post(
        'https://api.miro.com/v2/boards',
        {
          name: 'Workshop Board - ' + new Date().toISOString(),
          description: 'Board with copied template items'
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const newBoardId = boardResponse.data.id;
      console.log('✅ Empty board created:', newBoardId);
      
      // Try to get items from template
      const itemsResponse = await axios.get(
        `https://api.miro.com/v2/boards/${templateId}/items`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      console.log('📋 Found', itemsResponse.data.data?.length || 0, 'items in template');
      console.log('📝 Manual copying would be needed for full template functionality');
      console.log('🔗 Empty board URL:', boardResponse.data.viewLink);
      
      return newBoardId;
      
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError.response?.data || fallbackError.message);
      return null;
    }
  }
}

testTemplateDuplicate().then(boardId => {
  if (boardId) {
    console.log('\n🎉 Final result - Board ID:', boardId);
  } else {
    console.log('\n❌ Could not create board from template');
  }
});
