require('dotenv').config();
const axios = require('axios');

async function testCorrectDuplication() {
  console.log('🧪 Testing correct Miro board duplication...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const templateId = process.env.MIRO_TEMPLATE_BRAINSTORMING;
  
  console.log('📋 Template ID:', templateId);
  
  // Method: Use the correct duplication API
  console.log('\n🔄 Testing POST /boards with copy_from parameter...');
  try {
    const response = await axios.post(
      'https://api.miro.com/v2/boards',
      {
        name: 'Correct Duplication Test',
        description: 'Testing the correct way to duplicate a board',
        copy_from: templateId  // Try underscore instead of camelCase
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const boardId = response.data.id;
    console.log('✅ Board created:', boardId);
    console.log('🔗 URL:', response.data.viewLink);
    
    // Check if it has content
    const items = await axios.get(`https://api.miro.com/v2/boards/${boardId}/items`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    console.log('📋 Items copied:', items.data.data?.length || 0);
    
    if (items.data.data?.length > 0) {
      console.log('✅ SUCCESS! Template content was copied');
      return boardId;
    } else {
      console.log('❌ Board created but no content copied');
    }
    
  } catch (error) {
    console.log('❌ copy_from failed:', error.response?.data || error.message);
  }
  
  // Alternative: Try the v1 API which might have different duplication support
  console.log('\n🔄 Testing v1 API duplication...');
  try {
    const response = await axios.post(
      'https://api.miro.com/v1/boards',
      {
        name: 'V1 API Duplication Test',
        copyFromBoardId: templateId
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ V1 API board created:', response.data.id);
    
  } catch (error) {
    console.log('❌ V1 API failed:', error.response?.data || error.message);
  }
  
  // Last resort: Check if we can use a different approach
  console.log('\n🔄 Checking available board operations...');
  try {
    // Try to see what operations are available on the template board
    const response = await axios.options(
      `https://api.miro.com/v2/boards/${templateId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    console.log('📋 Available operations:', response.headers.allow);
    
  } catch (error) {
    console.log('❌ Options check failed:', error.response?.data || error.message);
  }
  
  return null;
}

testCorrectDuplication().then(boardId => {
  if (boardId) {
    console.log('\n🎉 SUCCESS! Board with template content:', boardId);
  } else {
    console.log('\n❌ All duplication methods failed - Miro API may not support template copying');
  }
});
