#!/usr/bin/env node

/**
 * Diagnostic script to test database connectivity and signup functionality
 */

import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/db';

const DiagnoseError = (error: string) => {
  return (
    <>
      <div style={{ color: 'red', width: '200px', textAlign: 'center', margin: '3rem auto' }}>{ error }</div>
    </>
  )
}

const DiagnoseSuccess = (message: string) => {
  return (
    <>
      <div style={{ color: 'green', width: '200px', textAlign: 'center', margin: '3rem auto' }}>{ message }</div>
    </>
  )
}

async function diagnoseSignupIssue() {
  console.log('🔍 Diagnosing signup issue...\n');
  
  // Test 1: Database Connection
  console.log('Test 1: Database Connection');
  try {
    await prisma.$connect();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', (error as Error).message);
    console.log('\nSolution: Make sure PostgreSQL is running and accessible');
    console.log('   Run: sudo systemctl start postgresql');
    console.log('   Or: brew services start postgresql (on macOS)');
    return DiagnoseError('Database connection failed');
  }
  
  // Test 2: User Table Structure
  console.log('\nTest 2: User Table Structure');
  try {
    const userCount = await prisma.user.count();
    console.log(`User table accessible - ${userCount} existing users`);
  } catch (error) {
    console.error('User table issue:', (error as Error).message);
    console.log('\nSolution: Run database migrations');
    console.log('   Run: npx prisma migrate dev');
    return DiagnoseError('User table issue');
  }
  
  // Test 3: Create Test User
  console.log('\nTest 3: Test User Creation');
  try {
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: '$2b$10$testhashedpassword',
        role: 'FAN',
      },
    });
    
    console.log('Test user created successfully:', testUser.id);
    
    // Clean up test user
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('Test user cleaned up');
    
  } catch (error) {
    console.error('User creation failed:', (error as Error).message);
    return DiagnoseError('User creation failed');
  }
  
  // Test 4: Check Database URL
  console.log('\nTest 4: Environment Configuration');
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL || 'NOT SET'}`);
  
  await prisma.$disconnect();
  console.log('\nDiagnostic complete!');


  // Test 5: View users
  console.log('\nTest 2: Find users');
  try {
    const userCount = await prisma.user.findMany();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    console.log(users);
  } catch (error) {
    console.error('Finding Users issue:', (error as Error).message);
    return DiagnoseError('Finding Users issue');
  }


  // success
  return DiagnoseSuccess("No issues");
}

// Run the diagnostic
export default function Diagnosis() {
  return diagnoseSignupIssue();
}
// diagnoseSignupIssue().catch(console.error);

