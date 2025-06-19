require('dotenv').config();
const axios = require('axios');

async function testSimpleItemCreation() {
  console.log('🧪 Testing simple item creation to understand API format...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  
  try {
    // Create a test board
    const board = await axios.post(
      'https://api.miro.com/v2/boards',
      { name: 'API Format Test' },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const boardId = board.data.id;
    console.log('✅ Test board created:', boardId);
    
    // Test 1: Create a simple text item
    console.log('\n🔄 Testing text creation...');
    try {
      const textResponse = await axios.post(
        `https://api.miro.com/v2/boards/${boardId}/texts`,
        {
          data: {
            content: '<p>Hello World</p>'
          },
          position: {
            x: 0,
            y: 0,
            origin: 'center'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Text created successfully');
    } catch (error) {
      console.log('❌ Text creation failed:', error.response?.data);
    }
    
    // Test 2: Create a simple sticky note
    console.log('\n🔄 Testing sticky note creation...');
    try {
      const stickyResponse = await axios.post(
        `https://api.miro.com/v2/boards/${boardId}/sticky_notes`,
        {
          data: {
            content: '<p>Test sticky note</p>',
            shape: 'square'
          },
          position: {
            x: 100,
            y: 100,
            origin: 'center'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Sticky note created successfully');
    } catch (error) {
      console.log('❌ Sticky note creation failed:', error.response?.data);
    }
    
    // Test 3: Create a simple frame
    console.log('\n🔄 Testing frame creation...');
    try {
      const frameResponse = await axios.post(
        `https://api.miro.com/v2/boards/${boardId}/frames`,
        {
          data: {
            title: 'Test Frame',
            format: 'custom'
          },
          position: {
            x: 200,
            y: 200,
            origin: 'center'
          },
          geometry: {
            width: 300,
            height: 200
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Frame created successfully');
    } catch (error) {
      console.log('❌ Frame creation failed:', error.response?.data);
    }
    
    console.log('\n🔗 Test board URL:', board.data.viewLink);
    return boardId;
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    return null;
  }
}

testSimpleItemCreation().then(boardId => {
  if (boardId) {
    console.log('\n🎉 Test completed. Check the board to see what worked!');
  }
});
