import { NextResponse } from 'next/server';
import { db } from '@/app/firebase/admin';

export async function GET() {
  try {
    // Test Firestore connection
    const testDoc = db.collection('test').doc('connection');
    await testDoc.set({
      timestamp: new Date().toISOString(),
      message: 'Test connection',
    });

    // Read it back
    const doc = await testDoc.get();
    
    return NextResponse.json({
      success: true,
      data: doc.data(),
      exists: doc.exists,
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: 'Database test failed', details: error },
      { status: 500 }
    );
  }
}
