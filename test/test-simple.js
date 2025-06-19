const axios = require('axios');

async function test() {
  try {
    const response = await axios.post('http://localhost:3001/api/workshops/5a8a54bc-e8d6-4cec-9cee-0e96b851f22e/create-miro-board');
    console.log('SUCCESS');
  } catch (error) {
    console.log('ERROR:', error.response?.status || error.message);
  }
}

test();
