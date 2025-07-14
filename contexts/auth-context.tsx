"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, API_ENDPOINTS } from "@/lib/api";
import {
  TOKEN_KEYS,
  isAuthenticated,
  logout as authLogout,
  UserData,
} from "@/lib/auth";

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (
    token: string,
    code: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // Check if user is authenticated
        if (!isAuthenticated()) {
          setUser(null);
          return;
        }

        // Always fetch user data from API
        try {
          const response = await api.get(API_ENDPOINTS.AUTH.WHOAMI);
          const data = response.data;
          setUser(data);
        } catch (error) {
          console.error("Error fetching user:", error);
          // If API call fails, clear auth state
          authLogout();
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const setAuthCookie = (token: string) => {
    // Set cookie for 7 days, path=/, secure, sameSite=lax
    document.cookie = `access_token=${token}; path=/; max-age=${
      60 * 60 * 24 * 7
    }; secure; samesite=lax`;
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const data = response.data;

      // Save tokens
      if (data.accessToken) {
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, data.accessToken);
        setAuthCookie(data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, data.refreshToken);
      }

      // Set user data from response
      if (data.user) {
        setUser(data.user);
      }

      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      return { success: false, error: errorMessage };
    }
  };

  const verifyEmail = async (
    token: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY, {
        token,
        code,
      });

      const data = response.data;

      // Save tokens if provided
      if (data.accessToken) {
        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, data.accessToken);
        setAuthCookie(data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, data.refreshToken);
      }

      // Set user data from response
      if (data.user) {
        setUser(data.user);
      }

      return { success: true };
    } catch (error: any) {
      console.error("Email verification error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Verification failed";
      return { success: false, error: errorMessage };
    }
  };

  const clearAuthCookie = () => {
    // Set the cookie to expire in the past
    document.cookie = `access_token=; path=/; max-age=0; secure; samesite=lax`;
  };

  const logout = () => {
    authLogout();
    clearAuthCookie();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.WHOAMI);
      const data = response.data;
      setUser(data);
    } catch (error) {
      console.error("Error refreshing user:", error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    verifyEmail,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
