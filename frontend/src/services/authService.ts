import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  points: number;
  createdAt: Date;
  lastLogin?: Date;
}

export class AuthService {
  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await this.updateLastLogin(result.user.uid);
      return result.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Register new user
  static async register(email: string, password: string, name: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(result.user, { displayName: name });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        name: name,
        role: 'user',
        points: 0,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      await setDoc(doc(db, 'users', result.user.uid), userProfile);

      return result.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  static async signOut() {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Error al cerrar sesión');
    }
  }

  // Get current user profile
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate(),
          lastLogin: data.lastLogin?.toDate()
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Update user points
  static async updateUserPoints(uid: string, points: number) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { points }, { merge: true });
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  }

  // Update last login
  private static async updateLastLogin(uid: string) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Get error message from Firebase error code
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'El email ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      case 'auth/invalid-email':
        return 'Email inválido';
      default:
        return 'Error de autenticación';
    }
  }
}
