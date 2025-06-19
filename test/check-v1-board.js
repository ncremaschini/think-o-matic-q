require('dotenv').config();
const axios = require('axios');

async function checkV1Board() {
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const boardId = 'uXjVIq4h41c='; // The V1 API board
  
  console.log('🔍 Checking V1 API board content...');
  console.log('📋 Board ID:', boardId);
  
  try {
    // Check board info
    const boardInfo = await axios.get(
      `https://api.miro.com/v2/boards/${boardId}`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    
    console.log('✅ Board info:');
    console.log('- Name:', boardInfo.data.name);
    console.log('- URL:', boardInfo.data.viewLink);
    
    // Check items
    const items = await axios.get(
      `https://api.miro.com/v2/boards/${boardId}/items`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    
    console.log('📋 Items in V1 board:', items.data.data?.length || 0);
    
    if (items.data.data?.length > 0) {
      console.log('🎉 SUCCESS! V1 API copied the template content!');
      items.data.data.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.type}: ${item.data?.content || item.data?.text || 'No content'}`);
      });
      return true;
    } else {
      console.log('❌ V1 board is also empty');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error checking V1 board:', error.response?.data || error.message);
    return false;
  }
}

checkV1Board();
