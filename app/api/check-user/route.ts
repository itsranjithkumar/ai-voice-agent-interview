import { NextResponse } from 'next/server';
import { db } from '@/app/firebase/admin';

export async function GET() {
  try {
    // Replace with your test user ID
    const userId = 'PR9ph63nvHMktyFOxMDCoSVaAbm2';
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User document not found' },
        { status: 404 }
      );
    }
    
    const userData = userDoc.data();
    
    return NextResponse.json({
      success: true,
      exists: userDoc.exists,
      data: userData,
      metadata: {
        id: userDoc.id,
        path: userDoc.ref.path,
        createTime: userDoc.createTime?.toDate().toISOString(),
        updateTime: userDoc.updateTime?.toDate().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { error: 'Failed to check user', details: error },
      { status: 500 }
    );
  }
}
