// Simple database connection test
const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'passa',
    password: 'password',
    database: 'passa_dev',
  });

  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    console.log('🧪 Testing query...');
    const result = await client.query('SELECT version()');
    console.log('✅ Query successful:', result.rows[0].version);
    
    console.log('🔍 Checking permissions...');
    const permissionTest = await client.query(`
      SELECT 
        has_database_privilege('passa', 'passa_dev', 'CREATE') as can_create_db,
        has_schema_privilege('passa', 'public', 'CREATE') as can_create_schema,
        has_schema_privilege('passa', 'public', 'USAGE') as can_use_schema
    `);
    console.log('✅ Permissions:', permissionTest.rows[0]);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.code === '3D000') {
      console.log('💡 Database "passa_dev" does not exist. Please create it first.');
    } else if (error.code === '28P01') {
      console.log('💡 Authentication failed. Please check username/password.');
    } else if (error.code === '42501') {
      console.log('💡 Permission denied. Please grant proper permissions to the "passa" user.');
    }
  } finally {
    await client.end();
  }
}

testConnection();
