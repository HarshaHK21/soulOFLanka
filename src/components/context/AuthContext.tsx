 import React, { createContext, useState, useEffect, ReactNode } from 'react';

    // Define the shape of your user data
    export interface UserData {
      id: string;
      username: string;
      email: string;
      role: 'user' | 'vendor' | 'admin';
      businessName?: string;
      isVerified?: boolean; // Add isVerified to UserData
    }

    // Define the shape of the AuthContext
    interface AuthContextType {
      user: UserData | null;
      token: string | null;
      isAuthenticated: boolean;
      login: (token: string, userData: UserData) => void;
      logout: () => void;
      // You might add functions to update user data, etc.
    }

    // Create the context with a default null value
    export const AuthContext = createContext<AuthContextType | null>(null);

    // Define props for AuthProvider
    interface AuthProviderProps {
      children: ReactNode;
    }

    // AuthProvider component to wrap your application
    export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
      const [user, setUser] = useState<UserData | null>(null);
      const [token, setToken] = useState<string | null>(null);
      const [isAuthenticated, setIsAuthenticated] = useState(false);

      // Load auth state from localStorage on initial load
      useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          try {
            const parsedUser: UserData = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (e) {
            console.error("Failed to parse user data from localStorage", e);
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }, []);

      // Login function
      const login = (newToken: string, userData: UserData) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
      };

      // Logout function
      const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      };

      // Context value that will be provided to consumers
      const contextValue: AuthContextType = {
        user,
        token,
        isAuthenticated,
        login,
        logout,
      };

      return (
        <AuthContext.Provider value={contextValue}>
          {children}
        </AuthContext.Provider>
      );
    };
    
