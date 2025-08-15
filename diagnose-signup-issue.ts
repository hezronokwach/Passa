#!/usr/bin/env node

/**
 * Diagnostic script to test database connectivity and signup functionality
 */

import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/db';

async function diagnoseSignupIssue() {
  console.log('🔍 Diagnosing signup issue...\n');
  
  // Test 1: Database Connection
  console.log('📊 Test 1: Database Connection');
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', (error as Error).message);
    console.log('\n💡 Solution: Make sure PostgreSQL is running and accessible');
    console.log('   Run: sudo systemctl start postgresql');
    console.log('   Or: brew services start postgresql (on macOS)');
    return;
  }
  
  // Test 2: User Table Structure
  console.log('\n📊 Test 2: User Table Structure');
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ User table accessible - ${userCount} existing users`);
  } catch (error) {
    console.error('❌ User table issue:', (error as Error).message);
    console.log('\n💡 Solution: Run database migrations');
    console.log('   Run: npx prisma migrate dev');
    return;
  }
  
  // Test 3: Create Test User
  console.log('\n📊 Test 3: Test User Creation');
  try {
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: '$2b$10$testhashedpassword',
        role: 'FAN',
      },
    });
    
    console.log('✅ Test user created successfully:', testUser.id);
    
    // Clean up test user
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ Test user cleaned up');
    
  } catch (error) {
    console.error('❌ User creation failed:', (error as Error).message);
  }
  
  // Test 4: Check Database URL
  console.log('\n📊 Test 4: Environment Configuration');
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL || 'NOT SET'}`);
  
  await prisma.$disconnect();
  console.log('\n🎯 Diagnostic complete!');
}

// Run the diagnostic
diagnoseSignupIssue().catch(console.error);
