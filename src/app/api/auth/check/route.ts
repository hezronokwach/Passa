import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    console.log('Session check:', session);
    
    if (session && session.userId) {
      return NextResponse.json({
        authenticated: true,
        userId: session.userId,
        role: session.role
      });
    }
    
    return NextResponse.json({
      authenticated: false,
      userId: null,
      role: null
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      authenticated: false,
      userId: null,
      role: null
    });
  }
}