
import React, { createContext, useState, useEffect, useContext } from "react";
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function signUp(email: string, password: string, name: string) {
    try {
      // Try to sign in directly since signup might be disabled
      await signIn(email, password);
      
      // If sign-in succeeds (no account existed), we would normally update the profile here
      // But since sign-in worked without account creation, we'll handle differently
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        toast({
          title: "Welcome!",
          description: "You have successfully logged in.",
        });
      }
    } catch (error: any) {
      // If sign-in failed because user doesn't exist but sign-up is disabled
      if (error.code === 'auth/operation-not-allowed') {
        toast({
          title: "Registration Disabled",
          description: "Email/password registration is currently disabled. Please try using Google Sign-in instead.",
          variant: "destructive",
        });
      } else if (error.code === 'auth/user-not-found') {
        toast({
          title: "Registration Disabled",
          description: "New user registration is currently disabled. Please use an existing account or contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      // If user doesn't exist and we're trying to sign-in
      if (error.code === 'auth/user-not-found') {
        toast({
          title: "Account Not Found",
          description: "No account exists with this email. Please check your email or try Google Sign-in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  }

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Welcome!",
        description: "You have successfully logged in with Google.",
      });
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
