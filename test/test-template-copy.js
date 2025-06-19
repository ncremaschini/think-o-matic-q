require('dotenv').config();
const axios = require('axios');

async function testTemplateCopy() {
  console.log('🧪 Testing Miro template copying...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const templateId = process.env.MIRO_TEMPLATE_BRAINSTORMING; // Should be 'uXjVI1oEMo0='
  
  console.log('📋 Template ID:', templateId);
  console.log('🔑 Access token:', accessToken ? 'Found' : 'Missing');
  
  try {
    // First create a new empty board
    console.log('📋 Creating new board...');
    const boardResponse = await axios.post(
      'https://api.miro.com/v2/boards',
      {
        name: 'Template Copy Test - ' + new Date().toISOString(),
        description: 'Testing template copying functionality'
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const newBoardId = boardResponse.data.id;
    console.log('✅ New board created:', newBoardId);
    console.log('🔗 Board URL:', boardResponse.data.viewLink);
    
    // Now try to copy template content to the new board
    console.log('🔄 Copying template content...');
    
    try {
      const copyResponse = await axios.post(
        `https://api.miro.com/v2/boards/${newBoardId}/copy`,
        {
          source: {
            type: 'board',
            id: templateId
          },
          copy: {
            boardPermissionPolicy: 'team_editors_with_sharing_settings'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Template copied successfully!');
      console.log('📋 Final board ID:', newBoardId);
      console.log('🔗 Final board URL:', boardResponse.data.viewLink);
      
    } catch (copyError) {
      console.log('❌ Template copy failed:', copyError.response?.data || copyError.message);
      console.log('📝 Board created but without template content');
      console.log('📋 Empty board ID:', newBoardId);
      console.log('🔗 Empty board URL:', boardResponse.data.viewLink);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testTemplateCopy();
