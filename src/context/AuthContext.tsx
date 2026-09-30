import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import { auth, isFirebaseConfigured } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged
} from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  loginDemo: () => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (name: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const profile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Job Seeker',
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            resumesCount: StorageService.getResumes(firebaseUser.uid).length
          };
          setUser(profile);
          StorageService.setCurrentUser(profile);
        } else {
          setUser(null);
          StorageService.setCurrentUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local development / fallback mode
      const stored = StorageService.getCurrentUser();
      if (stored) {
        setUser(stored);
      }
      setLoading(false);
    }
  }, []);

  const signup = async (email: string, pass: string, name: string) => {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await firebaseUpdateProfile(cred.user, { displayName: name });
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: name,
        createdAt: new Date().toISOString(),
        resumesCount: 0
      };
      setUser(profile);
      StorageService.setCurrentUser(profile);
    } else {
      // Local Auth simulation with full persistence
      const uid = 'usr_' + Math.random().toString(36).substring(2, 10);
      const profile: UserProfile = {
        uid,
        email,
        displayName: name || 'Job Seeker',
        createdAt: new Date().toISOString(),
        resumesCount: 0
      };
      setUser(profile);
      StorageService.setCurrentUser(profile);
    }
  };

  const login = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || 'Job Seeker',
        photoURL: cred.user.photoURL || undefined,
        createdAt: cred.user.metadata.creationTime || new Date().toISOString(),
        resumesCount: StorageService.getResumes(cred.user.uid).length
      };
      setUser(profile);
      StorageService.setCurrentUser(profile);
    } else {
      // Check stored users or create/log in
      const allUsers = StorageService.getAllUsers();
      let existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!existing) {
        // Create profile for this email
        const uid = 'usr_' + Math.random().toString(36).substring(2, 10);
        existing = {
          uid,
          email,
          displayName: email.split('@')[0] || 'Job Seeker',
          createdAt: new Date().toISOString(),
          resumesCount: 0
        };
      }
      setUser(existing);
      StorageService.setCurrentUser(existing);
    }
  };

  const loginDemo = () => {
    const demoUser: UserProfile = {
      uid: 'demo_user_alex',
      email: 'alex.rivera.dev@gmail.com',
      displayName: 'Alex Rivera',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      createdAt: '2025-01-15T10:00:00.000Z',
      resumesCount: 1
    };
    setUser(demoUser);
    StorageService.setCurrentUser(demoUser);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
    StorageService.setCurrentUser(null);
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      // Local simulation: emulate email dispatch
      await new Promise(r => setTimeout(r, 600));
    }
  };

  const updateUser = async (displayName: string, photoURL?: string) => {
    if (!user) return;
    if (isFirebaseConfigured && auth?.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, { displayName, photoURL });
    }
    const updated: UserProfile = {
      ...user,
      displayName,
      photoURL: photoURL !== undefined ? photoURL : user.photoURL
    };
    setUser(updated);
    StorageService.setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        loginDemo,
        logout,
        resetPassword,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
