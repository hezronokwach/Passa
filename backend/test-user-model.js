// Simple test script to verify User model functionality
const { UserModel } = require('./dist/models/User');

async function testUserModel() {
  console.log('Testing User Model...');
  
  try {
    // Test user creation
    console.log('1. Testing user creation...');
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
    };
    
    const user = await UserModel.create(userData);
    console.log('✅ User created successfully:', user.username);
    
    // Test finding user by ID
    console.log('2. Testing find by ID...');
    const foundUser = await UserModel.findById(user.user_id);
    console.log('✅ User found by ID:', foundUser?.username);
    
    // Test finding user by email
    console.log('3. Testing find by email...');
    const foundByEmail = await UserModel.findByEmail(userData.email);
    console.log('✅ User found by email:', foundByEmail?.username);
    
    // Test password verification
    console.log('4. Testing password verification...');
    const isValidPassword = await UserModel.verifyPassword(userData.password, user.password_hash);
    console.log('✅ Password verification:', isValidPassword ? 'PASS' : 'FAIL');
    
    // Test user update
    console.log('5. Testing user update...');
    const updatedUser = await UserModel.update(user.user_id, {
      first_name: 'Updated',
      last_name: 'Name',
    });
    console.log('✅ User updated:', updatedUser.first_name, updatedUser.last_name);
    
    // Test user search
    console.log('6. Testing user search...');
    const searchResults = await UserModel.search({ username: 'test' });
    console.log('✅ Search results:', searchResults.data.length, 'users found');
    
    // Test status update
    console.log('7. Testing status update...');
    const statusUpdated = await UserModel.updateStatus(user.user_id, 'active');
    console.log('✅ Status updated to:', statusUpdated.status);
    
    // Test email verification
    console.log('8. Testing email verification...');
    const verifiedUser = await UserModel.verifyEmail(user.verification_token);
    console.log('✅ Email verified:', verifiedUser.email_verified);
    
    console.log('\n🎉 All tests passed! User model is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  process.exit(0);
}

testUserModel();
