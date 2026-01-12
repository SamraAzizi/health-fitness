'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  fullName: string;
  profilePicture?: string;
  currentWeight?: number;
  dailyCalorieGoal?: number;
  dailyWaterGoal?: number;
  fitnessLevel?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('healthTracker_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get stored users
    const usersStr = localStorage.getItem('healthTracker_users');
    const users = usersStr ? JSON.parse(usersStr) : {};

    // Check if user exists and password matches
    if (users[email] && users[email].password === password) {
      const userData = { ...users[email] };
      delete userData.password; // Don't store password in session
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('healthTracker_user', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const signup = async (data: any): Promise<boolean> => {
    const { email, password, fullName, profilePicture } = data;

    // Get existing users
    const usersStr = localStorage.getItem('healthTracker_users');
    const users = usersStr ? JSON.parse(usersStr) : {};

    // Check if user already exists
    if (users[email]) {
      return false;
    }

    // Create new user
    users[email] = {
      email,
      password,
      fullName,
      profilePicture: profilePicture || null,
      currentWeight: 0,
      dailyCalorieGoal: 2500,
      dailyWaterGoal: 8,
      fitnessLevel: 'beginner',
      createdAt: new Date().toISOString(),
    };

    // Save users
    localStorage.setItem('healthTracker_users', JSON.stringify(users));

    // Auto login after signup
    const userData = { ...users[email] };
    delete userData.password;
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('healthTracker_user', JSON.stringify(userData));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('healthTracker_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
