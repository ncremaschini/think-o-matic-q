require('dotenv').config();
const axios = require('axios');

async function testCopyEndpoint() {
  console.log('🧪 Testing direct copy endpoint from Miro documentation...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const templateId = process.env.MIRO_TEMPLATE_BRAINSTORMING;
  
  console.log('📋 Template ID:', templateId);
  
  try {
    // Use the direct copy endpoint: POST /v2/boards/{board_id}/copy
    console.log('🔄 Using POST /v2/boards/{board_id}/copy endpoint...');
    
    const response = await axios.post(
      `https://api.miro.com/v2/boards/${templateId}/copy`,
      {
        name: 'Workshop Board - Direct Copy Endpoint',
        description: 'Board created using direct copy endpoint from documentation'
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const newBoardId = response.data.id;
    console.log('✅ Board copied using direct endpoint:', newBoardId);
    console.log('🔗 URL:', response.data.viewLink);
    
    // Wait a moment for the copy operation to complete
    console.log('⏳ Waiting for copy operation to complete...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if content was copied
    const itemsResponse = await axios.get(
      `https://api.miro.com/v2/boards/${newBoardId}/items`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    
    const itemCount = itemsResponse.data.data?.length || 0;
    console.log('📋 Items in copied board:', itemCount);
    
    if (itemCount > 0) {
      console.log('🎉 SUCCESS! Template content was properly copied using direct endpoint!');
      itemsResponse.data.data.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.type}: ${item.data?.content || item.data?.title || 'No content'}`);
      });
      return newBoardId;
    } else {
      console.log('❌ Board created but no content copied');
      return newBoardId; // Still return the board ID for checking
    }
    
  } catch (error) {
    console.error('❌ Direct copy endpoint failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    return null;
  }
}

testCopyEndpoint().then(boardId => {
  if (boardId) {
    console.log('\n🎯 Board ID to check:', boardId);
    console.log('🔗 Please check this board manually to see if content was copied');
  } else {
    console.log('\n❌ Copy endpoint failed completely');
  }
});
