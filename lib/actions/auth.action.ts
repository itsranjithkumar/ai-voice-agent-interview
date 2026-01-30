"use server";

import { auth, db } from "@/app/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

async function verifyDocumentExists(collectionPath: string, docId: string) {
  try {
    console.log(`\nVerifying document ${collectionPath}/${docId}`);
    const docRef = db.collection(collectionPath).doc(docId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log('Document does not exist');
      return null;
    }
    
    const data = doc.data();
    console.log('Document data:', JSON.stringify(data, null, 2));
    console.log('Document ID:', doc.id);
    console.log('Document path:', doc.ref.path);
    
    // Get all collections under this document
    const collections = await doc.ref.listCollections();
    console.log('Subcollections:', collections.map(c => c.id));
    
    return data;
  } catch (error) {
    console.error('Error verifying document:', error);
    return null;
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  console.log('Starting sign in for email:', email);
  
  // Log environment variables for debugging
  console.log('Firebase Project ID:', process.env.FIREBASE_PROJECT_ID);
  console.log('Firebase Client Email:', process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not set');
  console.log('Firebase Private Key:', process.env.FIREBASE_PRIVATE_KEY ? 'Set' : 'Not set');

  try {
    // First verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log('Decoded token:', { 
      uid: decodedToken.uid, 
      email: decodedToken.email,
      auth_time: new Date(decodedToken.auth_time * 1000).toISOString()
    });
    
    // Get the full user record from Firebase Auth
    const userRecord = await auth.getUser(decodedToken.uid);
    console.log('User record from Auth:', { 
      uid: userRecord.uid, 
      email: userRecord.email, 
      displayName: userRecord.displayName,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime
      }
    });
    
    // Get database details
    const dbInfo = (db as any)._settings;
    console.log('Firestore Database Info:', {
      projectId: dbInfo.projectId,
      servicePath: dbInfo.servicePath,
      port: dbInfo.port,
      ssl: dbInfo.ssl,
      customHeaders: dbInfo.customHeaders ? 'Set' : 'Not set'
    });
    
    // Check if user exists in Firestore
    const usersCollection = db.collection("users");
    console.log('Firestore collection path:', usersCollection.path);
    
    const userRef = usersCollection.doc(userRecord.uid);
    console.log('User document path:', userRef.path);
    
    const userDoc = await userRef.get();
    
    console.log('Firestore user doc exists:', userDoc.exists);
    
    if (userDoc.exists) {
      const docData = userDoc.data();
      console.log('Document data:', JSON.stringify(docData, null, 2));
      
      // Get the document with metadata using type assertion
      const docWithMetadata = await userRef.get();
      const docAny = docWithMetadata as any;
      
      if (docAny.metadata) {
        console.log('Document metadata:', {
          hasPendingWrites: docAny.metadata.hasPendingWrites,
          fromCache: docAny.metadata.fromCache
        });
      }
      
      if (docAny.createTime) {
        console.log('Document create time:', docAny.createTime.toDate().toISOString());
      }
      if (docAny.updateTime) {
        console.log('Document update time:', docAny.updateTime.toDate().toISOString());
      }
    }
    
    // If user doesn't exist in Firestore, create the user document
    if (!userDoc.exists) {
      console.log('Creating new user in Firestore...');
      const userName = userRecord.displayName || email.split('@')[0];
      
      // Create a clean data object with all required fields
      const userData = {
        'name': userName,
        'email': email,
        'emailVerified': userRecord.emailVerified || false,
        'photoURL': userRecord.photoURL || '',
        'createdAt': new Date().toISOString(),
        'lastLogin': new Date().toISOString(),
        'updatedAt': new Date().toISOString(),
        'uid': userRecord.uid,  // Explicitly include UID in the document
        'providerData': userRecord.providerData?.map(p => ({
          providerId: p.providerId,
          email: p.email,
          displayName: p.displayName,
          photoURL: p.photoURL,
          uid: p.uid
        })) || []
      };
      
      console.log('User data to be saved:', JSON.stringify(userData, null, 2));
      
      try {
        console.log('Attempting to write to Firestore...');
        const writeResult = await userRef.set(userData, { merge: false });
        console.log('Write result:', {
          writeTime: writeResult.writeTime?.toDate().toISOString(),
          success: true
        });
        
        // Force a fresh read from Firestore
        console.log('Verifying document creation...');
        const createdDoc = await userRef.get();
        
        if (!createdDoc.exists) {
          console.error('Document still does not exist after creation!');
          throw new Error('Failed to create user document');
        }
        
        const docData = createdDoc.data();
        console.log('Document after creation:', {
          exists: createdDoc.exists,
          id: createdDoc.id,
          data: docData
        });
        
        // Also try to query the document
        try {
          const querySnapshot = await db.collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();
            
          console.log('Query results for email:', {
            size: querySnapshot.size,
            found: querySnapshot.docs.map(d => ({
              id: d.id,
              data: d.data()
            }))
          });
        } catch (queryError) {
          console.error('Error querying for user:', queryError);
        }
      } catch (firestoreError: any) {
        console.error('Error creating user in Firestore:', {
          code: firestoreError.code,
          message: firestoreError.message,
          details: firestoreError.details,
          stack: firestoreError.stack
        });
        throw firestoreError;
      }
    }

    await setSessionCookie(idToken);
    
    // Verify the document was created successfully
    await verifyDocumentExists('users', userRecord.uid);
    
    return {
      success: true,
      message: "Successfully signed in.",
    };
  } catch (error: any) {
    console.error("Error in signIn:", error);
    
    return {
      success: false,
      message: error.message || "Failed to sign in. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
// Helper function to manually check a document
export async function checkDocument(collection: string, docId: string) {
  try {
    console.log(`\n=== Checking document ${collection}/${docId} ===`);
    const docRef = db.collection(collection).doc(docId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log('Document does not exist');
      return null;
    }
    
    const data = doc.data();
    console.log('Document data:', JSON.stringify(data, null, 2));
    console.log('Document path:', doc.ref.path);
    
    // Try to get the document directly using admin SDK
    const admin = await import('firebase-admin');
    const adminDb = admin.firestore();
    const adminDoc = await adminDb.collection(collection).doc(docId).get();
    console.log('Admin SDK document exists:', adminDoc.exists);
    
    if (adminDoc.exists) {
      console.log('Admin SDK data:', adminDoc.data());
    }
    
    return data;
  } catch (error) {
    console.error('Error checking document:', error);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}