require('dotenv').config();
const axios = require('axios');

async function manualCopyWorking() {
  console.log('🧪 Testing working manual copy approach...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const templateId = process.env.MIRO_TEMPLATE_BRAINSTORMING;
  
  try {
    // 1. Create empty board
    console.log('📋 Creating empty board...');
    const newBoard = await axios.post(
      'https://api.miro.com/v2/boards',
      {
        name: 'Manual Copy Test - Working',
        description: 'Testing manual item copying that actually works'
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const newBoardId = newBoard.data.id;
    console.log('✅ Empty board created:', newBoardId);
    console.log('🔗 URL:', newBoard.data.viewLink);
    
    // 2. Get template items
    console.log('\n📋 Getting template items...');
    const templateItems = await axios.get(
      `https://api.miro.com/v2/boards/${templateId}/items`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    
    const items = templateItems.data.data || [];
    console.log('📋 Found', items.length, 'items in template');
    
    // 3. Copy items one by one with proper API calls
    let copiedCount = 0;
    
    for (const item of items) {
      try {
        console.log(`\n🔄 Copying ${item.type}...`);
        
        if (item.type === 'text') {
          await axios.post(
            `https://api.miro.com/v2/boards/${newBoardId}/texts`,
            {
              data: {
                content: item.data.content,
                style: item.data.style || {}
              },
              position: item.position || { x: 0, y: 0, origin: 'center' }
            },
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
          copiedCount++;
          console.log('✅ Text copied');
          
        } else if (item.type === 'sticky_note') {
          await axios.post(
            `https://api.miro.com/v2/boards/${newBoardId}/sticky_notes`,
            {
              data: {
                content: item.data.content || '<p>Sticky note</p>',
                shape: item.data.shape || 'square',
                style: item.data.style || { fillColor: 'light_yellow' }
              },
              position: item.position || { x: 100, y: 100, origin: 'center' }
            },
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
          copiedCount++;
          console.log('✅ Sticky note copied');
          
        } else if (item.type === 'frame') {
          await axios.post(
            `https://api.miro.com/v2/boards/${newBoardId}/frames`,
            {
              data: {
                title: item.data.title || 'Frame',
                format: item.data.format || 'custom',
                style: item.data.style || {}
              },
              position: item.position || { x: 0, y: 0, origin: 'center' },
              geometry: item.geometry || { width: 400, height: 300 }
            },
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
          copiedCount++;
          console.log('✅ Frame copied');
          
        } else {
          console.log(`⚠️  Skipping ${item.type} (not implemented)`);
        }
        
      } catch (copyError) {
        console.log(`❌ Failed to copy ${item.type}:`, copyError.response?.data?.message || copyError.message);
      }
    }
    
    console.log(`\n🎉 Copying complete! ${copiedCount}/${items.length} items copied`);
    console.log('🔗 Final board URL:', newBoard.data.viewLink);
    
    return newBoardId;
    
  } catch (error) {
    console.error('❌ Manual copy failed:', error.response?.data || error.message);
    return null;
  }
}

manualCopyWorking().then(boardId => {
  if (boardId) {
    console.log('\n🎉 SUCCESS! Manual copying worked. Board ID:', boardId);
  } else {
    console.log('\n❌ Manual copying failed');
  }
});
