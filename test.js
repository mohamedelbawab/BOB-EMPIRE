// test.js - Simple test suite for Bob Empire
const http = require('http');

console.log('🧪 Running Bob Empire Tests...\n');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const tests = [];
let passedTests = 0;
let failedTests = 0;

// Test helper function
function test(name, testFn) {
  tests.push({ name, testFn });
}

// HTTP request helper
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Define tests
test('Health Check Endpoint', async () => {
  const response = await makeRequest('/health');
  if (response.status === 200 && response.data.status === 'healthy') {
    return { passed: true, message: 'Health check passed' };
  }
  return { passed: false, message: `Health check failed: ${response.status}` };
});

test('AI Endpoint', async () => {
  const response = await makeRequest('/api/ai', {
    method: 'POST',
    body: { message: 'hello' }
  });
  if (response.status === 200 && response.data.reply) {
    return { passed: true, message: 'AI endpoint working' };
  }
  return { passed: false, message: `AI endpoint failed: ${response.status}` };
});

test('Super AI Endpoint', async () => {
  const response = await makeRequest('/api/super-ai', {
    method: 'POST',
    body: { command: '/status' }
  });
  if (response.status === 200 && response.data.reply) {
    return { passed: true, message: 'Super AI endpoint working' };
  }
  return { passed: false, message: `Super AI endpoint failed: ${response.status}` };
});

test('Products Endpoint', async () => {
  const response = await makeRequest('/api/products');
  if (response.status === 200 && Array.isArray(response.data)) {
    return { passed: true, message: 'Products endpoint working' };
  }
  return { passed: false, message: `Products endpoint failed: ${response.status}` };
});

test('Root Path Serves HTML', async () => {
  const response = await makeRequest('/');
  if (response.status === 200 && typeof response.data === 'string' && response.data.includes('Bob Empire')) {
    return { passed: true, message: 'Root path serves HTML correctly' };
  }
  return { passed: false, message: `Root path failed: ${response.status}` };
});

// Run tests
async function runTests() {
  console.log(`Running ${tests.length} tests...\n`);
  
  for (const { name, testFn } of tests) {
    try {
      const result = await testFn();
      if (result.passed) {
        console.log(`✅ ${name}: ${result.message}`);
        passedTests++;
      } else {
        console.log(`❌ ${name}: ${result.message}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ ${name}: Error - ${error.message}`);
      failedTests++;
    }
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`   Passed: ${passedTests}`);
  console.log(`   Failed: ${failedTests}`);
  console.log(`   Total:  ${tests.length}`);
  
  if (failedTests > 0) {
    console.log('\n⚠️  Some tests failed. Please check the server is running with "npm start"');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Bob Empire is ready for production.');
    process.exit(0);
  }
}

runTests();