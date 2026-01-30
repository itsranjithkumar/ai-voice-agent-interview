import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

function verifyEnvironment() {
  console.log('\n=== Environment Variables ===');
  console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Not set');
  console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not set');
  
  // Check if private key exists and has proper format
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  console.log('FIREBASE_PRIVATE_KEY:', privateKey ? 'Set' : 'Not set');
  
  if (privateKey) {
    const hasNewlines = privateKey.includes('\n');
    const hasEscapedNewlines = privateKey.includes('\\n');
    
    console.log('Private key format:', {
      hasNewlines,
      hasEscapedNewlines,
      firstLine: privateKey.split('\n')[0].substring(0, 20) + '...',
      keyLength: privateKey.length
    });
    
    // Fix the private key format if needed
    if (!hasNewlines && hasEscapedNewlines) {
      process.env.FIREBASE_PRIVATE_KEY = privateKey.replace(/\\\\n/g, '\n');
      console.log('Fixed private key format: Converted \\\\n to actual newlines');
    }
  }
  
  console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('==========================\n');
}

// Verify environment on import
verifyEnvironment();

let firebaseApp: App;

function getFirebaseConfig() {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('Missing Firebase configuration in environment variables');
    }

    // Ensure the private key has proper newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    return {
        credential: {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey
        },
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    };
}

try {
    if (!getApps().length) {
        console.log('Initializing Firebase Admin...');
        const config = getFirebaseConfig();
        
        firebaseApp = initializeApp({
            credential: cert({
                projectId: config.credential.projectId,
                clientEmail: config.credential.clientEmail,
                privateKey: config.credential.privateKey
            }),
            databaseURL: config.databaseURL
        });
        
        console.log('Firebase Admin initialized successfully');
        console.log('Connected to project:', config.credential.projectId);
    } else {
        firebaseApp = getApps()[0];
        console.log('Using existing Firebase Admin instance');
    }
} catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
}

// Initialize services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Log Firestore settings
console.log('Firestore settings:', {
    projectId: (db as any)._settings.projectId,
    servicePath: (db as any)._settings.servicePath,
    ssl: (db as any)._settings.ssl,
    customHeaders: (db as any)._settings.customHeaders ? 'Set' : 'Not set'
});

export { auth, db };

