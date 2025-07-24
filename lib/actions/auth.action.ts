"use server";
import { db } from "@/app/firebase/admin";
import { auth as adminAuth } from "@/app/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;
export async function signUp(params: SignUpParams) {
       const {uid, name, email, password} = params;

       try {
        const userDocRef = db.collection("users").doc(uid);
        const userRecord = await userDocRef.get();

        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please login.'
            };
        }

        // Only store name and email, never password
        await userDocRef.set({
            name,
            email
        });

        return {
            success: true,
            message: 'Account created successfully. Please sign in.'
        };
       } catch (e: any) {
            // Log the full error for debugging
            console.error('Error creating a user:', e?.message || e);

            // Return more specific error messages if possible
            if (e.code === 'auth/email-already-exists') {
                return {
                    success: false,
                    message: 'Email already exists.'
                };
            }
            if (e.code === 'permission-denied') {
                return {
                    success: false,
                    message: 'Permission denied. Please contact support.'
                };
            }
            if (typeof e.message === 'string') {
                return {
                    success: false,
                    message: e.message
                };
            }
            return {
                success: false,
                message: 'Something went wrong. Please try again.'
            };
       }

}


export async function signIn(params: SignInParams) {
    const {email, idToken} = params;

    try {
        const userRecord = await adminAuth.getUserByEmail(email)

        if(!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Create an account first'
            }
        }

        await setSessionCookie(idToken)

        return {
            success: true,
            message: 'Login successful'
        }

    } catch (e)  {
        console.error('Error signing in', e)
        return {
            success: false,
            message: 'Failed to login in an account'
        }
    }
    
}


export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await adminAuth.createSessionCookie(idToken,{
        expiresIn: ONE_WEEK * 1000,
    })

    cookieStore.set('session', sessionCookie, {
       maxAge: ONE_WEEK,
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'lax',
       path: '/',
    })
}
    
export async function getCurrentUser() : Promise<User | null> {
     const cookieStore = await cookies();


     const sessionCookie = cookieStore.get('session')?.value;


     if(!sessionCookie) return null;

     try{
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)

        const userRecord = await db.collection('users').doc(decodedClaims.uid).get()

        if(!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id

        } as User;

     }catch (e){
        console.log(e)
        return null;
     }



}


export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}
    
    