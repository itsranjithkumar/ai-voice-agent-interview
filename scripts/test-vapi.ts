require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const { vapi, assistantId } = require('../lib/vapi.sdk');

async function testVapiConnection() {
  console.log('Environment Variables:');
  console.log('NEXT_PUBLIC_VAPI_WEB_TOKEN:', process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN ? '***' : 'Not set');
  console.log('NEXT_PUBLIC_VAPI_ASSISTANT_ID:', process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
  try {
    console.log('Testing VAPI connection...');
    console.log('Assistant ID:', assistantId);
    
    // Test the VAPI instance
    console.log('VAPI instance created successfully');
    
    // Try to start a call
    console.log('Attempting to start a call...');
    await vapi.start(assistantId, {
      variableValues: {
        username: 'test-user',
        userid: 'test-user-id',
      },
    });
    
    console.log('Call started successfully!');
    
    // Stop the call after a short delay
    setTimeout(() => {
      vapi.stop();
      console.log('Call stopped');
    }, 3000);
    
  } catch (error) {
    console.error('Error testing VAPI connection:');
    console.error(error);
  }
}

testVapiConnection();
