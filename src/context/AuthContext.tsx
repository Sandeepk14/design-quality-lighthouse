
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { findUserByEmail, validateUserCredentials, createUser as createUserInDB } from '@/services/mongoService';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth in localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user");
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Use the MongoDB service to validate credentials
      const validUser = await validateUserCredentials(email, password);
      
      if (validUser) {
        const userData = {
          id: validUser.id,
          email: validUser.email,
          name: validUser.name
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', 'mock-jwt-token');
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        return true;
      }
      
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive"
      });
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Check if user already exists
      const existingUser = await findUserByEmail(email);
      
      if (existingUser) {
        toast({
          title: "Signup failed",
          description: "An account with this email already exists.",
          variant: "destructive"
        });
        return false;
      }
      
      // Create new user in DB
      const newUser = await createUserInDB(email, password, name);
      
      // Sign in the newly created user
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'mock-jwt-token');
      
      toast({
        title: "Account created",
        description: "Your account has been successfully created.",
      });
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "Please try again with different credentials.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
