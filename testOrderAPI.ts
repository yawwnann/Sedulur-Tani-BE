import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = 'http://localhost:8686/api/v1'; // Port backend adalah 8686

async function testOrderAPI() {
  try {
    console.log('🔐 Step 1: Login sebagai buyer@example.com (Pak Tani)...\n');
    
    // Login untuk mendapat token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'buyer@example.com',
      password: 'password123' // Default password dari seeder
    });

    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    
    console.log('✅ Login berhasil!');
    console.log(`   User: ${user.name} (${user.email})`);
    console.log(`   Role: ${user.role}`);
    console.log(`   User ID: ${user.id}`);
    console.log(`   Token: ${token.substring(0, 20)}...`);

    // Test get all orders
    console.log('\n📦 Step 2: Get All Orders...\n');
    
    const ordersResponse = await axios.get(`${API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Orders Retrieved Successfully!');
    console.log(`   Total Orders: ${ordersResponse.data.data.total}`);
    
    if (ordersResponse.data.data.orders.length > 0) {
      console.log('\n   Sample Orders (First 3):');
      ordersResponse.data.data.orders.slice(0, 3).forEach((order: any, index: number) => {
        console.log(`\n   ${index + 1}. Order ID: ${order.id}`);
        console.log(`      Product: ${order.product.name}`);
        console.log(`      Quantity: ${order.quantity}`);
        console.log(`      Price: Rp ${order.price_each.toLocaleString('id-ID')}`);
        console.log(`      Total: Rp ${order.total_price.toLocaleString('id-ID')}`);
        console.log(`      Status: ${order.status}`);
      });
    }

    // Test get single order
    if (ordersResponse.data.data.orders.length > 0) {
      const firstOrderId = ordersResponse.data.data.orders[0].id;
      
      console.log(`\n📦 Step 3: Get Single Order (ID: ${firstOrderId})...\n`);
      
      const singleOrderResponse = await axios.get(`${API_BASE_URL}/orders/${firstOrderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const singleOrder = singleOrderResponse.data.data.order;
      console.log('✅ Single Order Retrieved:');
      console.log(`   Order ID: ${singleOrder.id}`);
      console.log(`   Product: ${singleOrder.product.name}`);
      console.log(`   Status: ${singleOrder.status}`);
      console.log(`   Checkout Status: ${singleOrder.checkout.status}`);
    }

    // Test dengan seller account
    console.log('\n\n🔐 Step 4: Test dengan Seller Account (seller1@example.com)...\n');
    
    const sellerLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'seller1@example.com',
      password: 'password123'
    });

    const sellerToken = sellerLoginResponse.data.data.token;
    const seller = sellerLoginResponse.data.data.user;
    
    console.log('✅ Login sebagai seller berhasil!');
    console.log(`   User: ${seller.name} (${seller.email})`);
    console.log(`   Role: ${seller.role}`);

    const sellerOrdersResponse = await axios.get(`${API_BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${sellerToken}`
      }
    });

    console.log(`\n📦 Orders untuk produk yang dijual seller ini:`);
    console.log(`   Total: ${sellerOrdersResponse.data.data.total} orders`);

  } catch (error: any) {
    if (error.response) {
      console.error('❌ API Error:', error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server. Make sure the backend is running on the correct port.');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Alternative: Manual testing instructions
console.log('='.repeat(70));
console.log('📝 CARA TEST MANUAL DENGAN POSTMAN/INSOMNIA/THUNDER CLIENT:');
console.log('='.repeat(70));
console.log('\n1. LOGIN DULU:');
console.log('   POST http://localhost:8686/api/v1/auth/login');
console.log('   Body (JSON):');
console.log('   {');
console.log('     "email": "buyer@example.com",');
console.log('     "password": "password123"');
console.log('   }');
console.log('\n2. COPY TOKEN dari response login');
console.log('\n3. GET ORDERS:');
console.log('   GET http://localhost:8686/api/v1/orders');
console.log('   Headers:');
console.log('   Authorization: Bearer <TOKEN_YANG_DICOPY>');
console.log('\n4. UNTUK SELLER:');
console.log('   Login dengan: seller1@example.com / password123');
console.log('   Akan melihat orders untuk produk yang dijualnya');
console.log('='.repeat(70));
console.log('\n🚀 Menjalankan test otomatis...\n');

// Run the test
testOrderAPI();
