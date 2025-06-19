const axios = require('axios');

async function testServerMiro() {
  console.log('Testing server Miro integration...');
  
  try {
    const response = await axios.post('http://localhost:3001/api/workshops/5a8a54bc-e8d6-4cec-9cee-0e96b851f22e/create-miro-board');
    console.log('Success!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testServerMiro();
