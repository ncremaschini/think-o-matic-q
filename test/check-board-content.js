require('dotenv').config();
const axios = require('axios');

async function checkBoardContent() {
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const boardId = 'uXjVIqDFHAM='; // The board we just created
  
  console.log('🔍 Checking board content...');
  console.log('📋 Board ID:', boardId);
  console.log('🔗 Board URL: https://miro.com/app/board/' + boardId);
  
  try {
    // Get board info
    const boardInfo = await axios.get(
      `https://api.miro.com/v2/boards/${boardId}`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    
    console.log('\n✅ Board info:');
    console.log('- Name:', boardInfo.data.name);
    console.log('- Description:', boardInfo.data.description);
    
    // Get all items on the board
    const items = await axios.get(
      `https://api.miro.com/v2/boards/${boardId}/items`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    
    const itemCount = items.data.data?.length || 0;
    console.log('\n📋 Board contains', itemCount, 'items:');
    
    if (itemCount > 0) {
      // Group items by type
      const itemsByType = items.data.data.reduce((acc, item) => {
        acc[item.type] = acc[item.type] || [];
        acc[item.type].push(item);
        return acc;
      }, {});
      
      console.log('\n🔍 Items by type:');
      Object.entries(itemsByType).forEach(([type, items]) => {
        console.log(`\n${type.toUpperCase()} (${items.length}):`);
        items.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.data?.content || item.data?.title || item.data?.text || 'No content'}`);
        });
      });
      
      console.log('\n🎉 SUCCESS! Board has both template and workshop content!');
    } else {
      console.log('\n❌ Board is empty');
    }
    
  } catch (error) {
    console.error('❌ Error checking board:', error.response?.data || error.message);
  }
}

checkBoardContent();
