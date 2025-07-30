// Fix database permissions for the passa user
const { Client } = require('pg');

async function fixPermissions() {
  // First, try to connect as the passa user to see current permissions
  const passaClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'passa',
    password: 'password',
    database: 'passa_dev',
  });

  try {
    console.log('🔌 Connecting as passa user...');
    await passaClient.connect();
    
    console.log('🔧 Attempting to grant permissions to self...');
    
    // Try to grant permissions (this might work if passa is the owner)
    try {
      await passaClient.query('GRANT ALL ON SCHEMA public TO passa');
      await passaClient.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO passa');
      await passaClient.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO passa');
      await passaClient.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO passa');
      await passaClient.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO passa');
      console.log('✅ Permissions granted successfully!');
    } catch (permError) {
      console.log('⚠️  Could not grant permissions:', permError.message);
      console.log('💡 You may need to run this as a superuser (postgres)');
    }
    
    // Test creating a table
    console.log('🧪 Testing table creation...');
    try {
      await passaClient.query('CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name VARCHAR(50))');
      await passaClient.query('DROP TABLE IF EXISTS test_table');
      console.log('✅ Table creation test successful!');
    } catch (createError) {
      console.log('❌ Table creation failed:', createError.message);
      
      console.log('\n📋 To fix this, run the following commands as postgres user:');
      console.log('sudo -u postgres psql');
      console.log('\\c passa_dev');
      console.log('GRANT ALL ON SCHEMA public TO passa;');
      console.log('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO passa;');
      console.log('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO passa;');
      console.log('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO passa;');
      console.log('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO passa;');
      console.log('\\q');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await passaClient.end();
  }
}

fixPermissions();
