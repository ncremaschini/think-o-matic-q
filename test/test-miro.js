const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function testMiroConnection() {
  console.log('🧪 Testing Miro API Connection...');
  
  const accessToken = process.env.MIRO_ACCESS_TOKEN;
  const workspaceId = process.env.MIRO_DEFAULT_WORKSPACE_ID;
  
  if (!accessToken) {
    console.error('❌ MIRO_ACCESS_TOKEN not found in .env file');
    return;
  }
  
  if (!workspaceId) {
    console.error('❌ MIRO_DEFAULT_WORKSPACE_ID not found in .env file');
    return;
  }
  
  console.log('✅ Environment variables loaded');
  console.log(`📋 Workspace ID: ${workspaceId}`);
  console.log(`🔑 Access Token: ${accessToken.substring(0, 20)}...`);
  
  try {
    // Test API connection by getting user info
    const response = await axios.get('https://api.miro.com/v2/boards', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        limit: 1
      }
    });
    
    console.log('✅ Miro API connection successful!');
    console.log(`📊 Found ${response.data.data?.length || 0} boards`);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log(`📋 Sample board: ${response.data.data[0].name}`);
    }
    
  } catch (error) {
    console.error('❌ Miro API connection failed:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data?.message || error.response.statusText}`);
    } else {
      console.error(error.message);
    }
  }
}

testMiroConnection();
