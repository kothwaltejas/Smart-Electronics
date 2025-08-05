// Simple test to check if backend is working
const testBackend = async () => {
  try {
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    console.log('Health check:', await healthResponse.json());
    
    // Test orders endpoint (will fail without auth, but shows if endpoint exists)
    const ordersResponse = await fetch('http://localhost:5000/api/orders/myorders');
    console.log('Orders endpoint status:', ordersResponse.status);
  } catch (error) {
    console.error('Backend test failed:', error);
  }
};

// Run test
testBackend();
