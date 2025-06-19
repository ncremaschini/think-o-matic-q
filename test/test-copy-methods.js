require('dotenv').config();
const axios = require('axios');

async function testCopyMethods() {
  console.log('🧪 Testing different board copying methods...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const templateId = process.env.MIRO_TEMPLATE_BRAINSTORMING;
  
  console.log('📋 Template ID:', templateId);
  
  // Method 1: copyFrom parameter (what we tried)
  console.log('\n🔄 Method 1: Testing copyFrom parameter...');
  try {
    const response1 = await axios.post(
      'https://api.miro.com/v2/boards',
      {
        name: 'Copy Test Method 1 - copyFrom',
        copyFrom: templateId
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const boardId1 = response1.data.id;
    console.log('✅ Board created:', boardId1);
    
    // Check if it has content
    const items1 = await axios.get(`https://api.miro.com/v2/boards/${boardId1}/items`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    console.log('📋 Items copied:', items1.data.data?.length || 0);
    console.log('🔗 URL:', response1.data.viewLink);
    
  } catch (error) {
    console.log('❌ Method 1 failed:', error.response?.data || error.message);
  }
  
  // Method 2: Try duplicate API endpoint
  console.log('\n🔄 Method 2: Testing duplicate endpoint...');
  try {
    const response2 = await axios.post(
      `https://api.miro.com/v2/boards/${templateId}/duplicate`,
      {
        name: 'Copy Test Method 2 - duplicate'
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Board duplicated:', response2.data.id);
    console.log('🔗 URL:', response2.data.viewLink);
    
  } catch (error) {
    console.log('❌ Method 2 failed:', error.response?.data || error.message);
  }
  
  // Method 3: Manual copying of items
  console.log('\n🔄 Method 3: Testing manual item copying...');
  try {
    // Create empty board
    const emptyBoard = await axios.post(
      'https://api.miro.com/v2/boards',
      {
        name: 'Copy Test Method 3 - manual copy'
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const newBoardId = emptyBoard.data.id;
    console.log('✅ Empty board created:', newBoardId);
    
    // Get template items
    const templateItems = await axios.get(`https://api.miro.com/v2/boards/${templateId}/items`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const items = templateItems.data.data || [];
    console.log('📋 Found', items.length, 'items to copy');
    
    // Try to copy a simple text item
    const textItems = items.filter(item => item.type === 'text');
    if (textItems.length > 0) {
      const textItem = textItems[0];
      console.log('📝 Copying text item:', textItem.data.content);
      
      const copyResponse = await axios.post(
        `https://api.miro.com/v2/boards/${newBoardId}/texts`,
        {
          data: {
            content: textItem.data.content,
            style: textItem.data.style || {}
          },
          position: textItem.position || { x: 0, y: 0 }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Text item copied successfully');
    }
    
    console.log('🔗 URL:', emptyBoard.data.viewLink);
    
  } catch (error) {
    console.log('❌ Method 3 failed:', error.response?.data || error.message);
  }
}

testCopyMethods();
