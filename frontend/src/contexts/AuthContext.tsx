import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  points: number;
  role: 'admin' | 'user';
  birthDate?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = AuthService.onAuthStateChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Get user profile from Firestore
        const userProfile = await AuthService.getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setUser({
            id: userProfile.uid,
            name: userProfile.name,
            email: userProfile.email,
            points: userProfile.points,
            role: userProfile.role
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await AuthService.signIn(email, password);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await AuthService.register(email, password, name);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user && firebaseUser) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      // Update points in Firestore if points changed
      if (userData.points !== undefined) {
        await AuthService.updateUserPoints(firebaseUser.uid, userData.points);
      }
    }
  };

  const value = {
    user,
    firebaseUser,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
