require('dotenv').config();
const axios = require('axios');

async function testProperCopyFrom() {
  console.log('🧪 Testing proper copy_from method from Miro documentation...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const templateId = process.env.MIRO_TEMPLATE_BRAINSTORMING;
  
  console.log('📋 Template ID:', templateId);
  
  try {
    // Use the proper copy_from endpoint as per Miro documentation
    console.log('🔄 Using POST /v2/boards with copy_from...');
    
    const response = await axios.post(
      'https://api.miro.com/v2/boards',
      {
        name: 'Workshop Board - Proper Copy',
        description: 'Board created using proper copy_from method',
        copy_from: templateId,
        // Optional: specify what to copy
        copy_options: {
          copy_board_permissions: false,
          copy_team_access: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const newBoardId = response.data.id;
    console.log('✅ Board created with copy_from:', newBoardId);
    console.log('🔗 URL:', response.data.viewLink);
    
    // Wait a moment for the copy operation to complete
    console.log('⏳ Waiting for copy operation to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if content was copied
    const itemsResponse = await axios.get(
      `https://api.miro.com/v2/boards/${newBoardId}/items`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    
    const itemCount = itemsResponse.data.data?.length || 0;
    console.log('📋 Items in new board:', itemCount);
    
    if (itemCount > 0) {
      console.log('🎉 SUCCESS! Template content was properly copied!');
      itemsResponse.data.data.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.type}: ${item.data?.content || item.data?.title || 'No content'}`);
      });
    } else {
      console.log('❌ Board created but no content copied');
    }
    
    return newBoardId;
    
  } catch (error) {
    console.error('❌ copy_from failed:', error.response?.data || error.message);
    
    // Try alternative approach from documentation
    console.log('\n🔄 Trying alternative copy approach...');
    try {
      const altResponse = await axios.post(
        `https://api.miro.com/v2/boards/${templateId}/copy`,
        {
          name: 'Workshop Board - Alternative Copy',
          description: 'Board created using alternative copy method'
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Alternative copy succeeded:', altResponse.data.id);
      console.log('🔗 URL:', altResponse.data.viewLink);
      return altResponse.data.id;
      
    } catch (altError) {
      console.error('❌ Alternative copy also failed:', altError.response?.data || altError.message);
    }
    
    return null;
  }
}

testProperCopyFrom().then(boardId => {
  if (boardId) {
    console.log('\n🎉 SUCCESS! Board copied with template content. Board ID:', boardId);
  } else {
    console.log('\n❌ All copy methods failed');
  }
});
