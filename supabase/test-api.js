/**
 * Test script voor Supabase API
 * Voer uit met: node supabase/test-api.js
 */

require('dotenv').config({ path: '.env.local' });

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing Timo Intelligence API...\n');
  console.log(`API URL: ${API_URL}\n`);

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check...');
  try {
    const healthRes = await fetch(`${API_URL}/health`);
    const health = await healthRes.json();
    console.log('✅ Health Check:', health);
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return;
  }

  // Test 2: Get Content
  console.log('\n2️⃣ Testing Get Content...');
  try {
    const contentRes = await fetch(`${API_URL}/content`);
    if (contentRes.status === 404) {
      console.log('⚠️  Content not found (this is OK for first run)');
    } else {
      const content = await contentRes.json();
      console.log('✅ Content retrieved:', Object.keys(content));
    }
  } catch (error) {
    console.error('❌ Get Content Failed:', error.message);
  }

  // Test 3: Save Content
  console.log('\n3️⃣ Testing Save Content...');
  try {
    const testContent = {
      hero: {
        tag: 'TEST',
        titleLine1: 'Test Title',
        titleLine2: 'Test Subtitle',
        description: 'Test description',
        buttonPrimary: 'Button 1',
        buttonSecondary: 'Button 2'
      },
      solutions: [],
      about: {
        tag: 'TEST',
        titleLine1: 'Test',
        titleLine2: 'Test',
        paragraph1: 'Test',
        paragraph2: 'Test',
        paragraph3: 'Test',
        feature1Title: 'Test',
        feature1Description: 'Test',
        feature2Title: 'Test',
        feature2Description: 'Test',
        imageUrl: '',
        imageCaption: '',
        imageSubcaption: ''
      },
      partners: {
        title: 'Test',
        description: 'Test',
        feature1Title: 'Test',
        feature1Description: 'Test',
        feature2Title: 'Test',
        feature2Description: 'Test'
      },
      contact: {
        title: 'Test',
        introText: 'Test',
        addressStreet: 'Test',
        addressPostalCode: 'Test',
        addressCity: 'Test',
        addressNote: 'Test',
        email: 'test@test.nl',
        phone: '123456789',
        formTitle: 'Test',
        buttonText: 'Test'
      }
    };

    const saveRes = await fetch(`${API_URL}/content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testContent)
    });

    if (saveRes.ok) {
      const result = await saveRes.json();
      console.log('✅ Content saved:', result);
    } else {
      const error = await saveRes.json();
      console.error('❌ Save Content Failed:', error);
    }
  } catch (error) {
    console.error('❌ Save Content Failed:', error.message);
  }

  // Test 4: Get History
  console.log('\n4️⃣ Testing Get History...');
  try {
    const historyRes = await fetch(`${API_URL}/content/history`);
    if (historyRes.ok) {
      const history = await historyRes.json();
      console.log(`✅ History retrieved: ${history.length} versions`);
    } else {
      console.log('⚠️  History endpoint not available or empty');
    }
  } catch (error) {
    console.error('❌ Get History Failed:', error.message);
  }

  console.log('\n✨ Tests completed!\n');
}

testAPI().catch(console.error);
