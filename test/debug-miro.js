const axios = require('axios');
require('dotenv').config();

async function testMiroBoard() {
  console.log('🧪 Testing Miro board creation...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error('❌ MIRO_ACCESS_TOKEN not found');
    return;
  }
  
  console.log('✅ Access token found');
  
  try {
    const boardData = {
      name: 'Test Workshop Board - Debug',
      description: 'Testing board creation from debug script'
    };

    console.log('📋 Creating board with data:', JSON.stringify(boardData, null, 2));

    const response = await axios.post('https://api.miro.com/v2/boards', boardData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Board created successfully!');
    console.log('📋 Board ID:', response.data.id);
    console.log('🔗 Board URL:', response.data.viewLink);
    
  } catch (error) {
    console.error('❌ Board creation failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testMiroBoard();
