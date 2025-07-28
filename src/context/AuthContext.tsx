"use client"

import type React from "react"

import { authService } from "@/services/authService"
import type { AccountResponse, ApiResponse, LoginRequest, RegisterRequest } from "@/types/auth"
import { createContext, useCallback, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

interface AuthContextType {
  isAuthenticated: boolean
  user: AccountResponse | null // Thông tin người dùng khi đã đăng nhập
  token: string | null // JWT token
  login: (credentials: LoginRequest) => Promise<ApiResponse<AccountResponse>>
  register: (data: RegisterRequest) => Promise<ApiResponse<AccountResponse>>
  logout: () => void
  refreshUserInfo: () => Promise<void> // Add method to refresh user info
  updateProfilePicture: (newProfilePicture: string) => void // Add this line
  isLoading: boolean // Trạng thái đang tải
}

// jwt & user info
const AUTH_TOKEN = "jwt_token"
const USER_INFO = "user_info"

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<AccountResponse | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true) // Start with true for initial auth check
  const navigate = useNavigate()
  // Helper function to validate token
  const isTokenValid = (token: string): boolean => {
    try {
      // Basic JWT structure check
      const parts = token.split(".")
      if (parts.length !== 3) return false

      // Decode payload to check expiry
      const payload = JSON.parse(atob(parts[1]))
      const currentTime = Math.floor(Date.now() / 1000)

      // Check if token is expired (with 30 second buffer)
      return payload.exp && payload.exp > currentTime + 30
    } catch {
      return false
    }
  }

  const clearAuthData = useCallback(() => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem(AUTH_TOKEN)
    localStorage.removeItem(USER_INFO)
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(AUTH_TOKEN)
        const storedUser = localStorage.getItem(USER_INFO)

        if (storedToken && storedUser) {
          // Validate token before using it
          if (isTokenValid(storedToken)) {
            const parsedUser = JSON.parse(storedUser) as AccountResponse
            setToken(storedToken)
            setUser(parsedUser)
            setIsAuthenticated(true)
          } else {
            // Token is invalid or expired, clear data
            console.warn("Stored token is invalid or expired")
            clearAuthData()
          }
        }
      } catch (err) {
        console.error("Error initializing auth from localStorage:", err)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [clearAuthData])

  // Update user from localStorage without API call
  const updateUserFromLocalStorage = useCallback((): void => {
    try {
      const userInfo = localStorage.getItem("user_info")
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        console.log('AuthContext: Updating user from localStorage:', parsedUser);
        setUser(parsedUser);
        console.log('AuthContext: User state updated successfully');
      }
    } catch (error) {
      console.error("Failed to update user from localStorage:", error)
    }
  }, [])

  const refreshUserInfo = useCallback(async (): Promise<void> => {
    try {
      const updatedUser = await authService.refreshUserInfo()
      if (updatedUser) {
        setUser(updatedUser)
        console.log("User info refreshed in AuthContext:", updatedUser)
      }
    } catch (error) {
      console.error("Failed to refresh user info in AuthContext:", error)
      // Fallback to localStorage if API fails
      updateUserFromLocalStorage()
    }
  }, [updateUserFromLocalStorage])

  // Add effect to listen for userInfoUpdated events
  useEffect(() => {
    const handleUserInfoUpdate = () => {
      console.log('User info update event received, updating from localStorage...');
      // Immediately update from localStorage
      updateUserFromLocalStorage();

      // Then try to refresh from API (for full sync, but don't fail if it errors)
      setTimeout(() => {
        refreshUserInfo().catch(error => {
          console.log('API refresh failed, but localStorage update succeeded:', error.message);
        });
      }, 100); // Small delay to ensure localStorage is updated
    }

    window.addEventListener('userInfoUpdated', handleUserInfoUpdate);
    window.addEventListener('profilePictureUpdated', handleUserInfoUpdate);
    return () => {
      window.removeEventListener('userInfoUpdated', handleUserInfoUpdate);
      window.removeEventListener('profilePictureUpdated', handleUserInfoUpdate);
    };
  }, [refreshUserInfo, updateUserFromLocalStorage]);

  const login = useCallback(async (credentials: LoginRequest): Promise<ApiResponse<AccountResponse>> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.status === 200 && response.data) {
        const { token, ...userData } = response.data;

        // Save to localStorage immediately
        localStorage.setItem(AUTH_TOKEN, token);
        localStorage.setItem(USER_INFO, JSON.stringify(userData));

        // Update state
        setToken(token);
        setUser(userData as AccountResponse);
        setIsAuthenticated(true);

        if (userData.role === "SUPER_ADMIN") {
          navigate("/admin/dashboard");
        } else if (userData.role === "NORMAL_MEMBER" || userData.role === "PREMIUM_MEMBER") {
          navigate("/");
        }
      }
      return response;
    } catch (err) {
      console.error("Login failed:", err);
      clearAuthData();
      return {
        status: 500,
        message: "Login failed",
        data: null,
        error: "An error occurred during login",
        errorCode: null,
        timestamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserInfo, updateUserFromLocalStorage])


  // sign up xong thi cap token luon de sang trang home
  const register = useCallback(
    async (data: RegisterRequest): Promise<ApiResponse<AccountResponse>> => {
      setIsLoading(true)
      try {
        const response = await authService.register(data)
        if (response.status === 200 && response.data) {
          const { token, ...userData } = response.data

          // Save to localStorage immediately
          localStorage.setItem(AUTH_TOKEN, token)
          localStorage.setItem(USER_INFO, JSON.stringify(userData))

          // Update state
          setToken(token)
          setUser(userData as AccountResponse)
          setIsAuthenticated(true)

          if (userData.role === "SUPER_ADMIN") {
            navigate("/admin/dashboard")
          } else if (userData.role === "NORMAL_MEMBER" || userData.role === "PREMIUM_MEMBER") {
            navigate("/")
          }
        }
        return response
      } catch (err) {
        console.error("Registration failed:", err)
        clearAuthData()
        return {
          status: 500,
          message: "Registration failed",
          data: null,
          error: "An error occurred during registration",
          errorCode: null,
          timestamp: new Date().toISOString(),
        }
      } finally {
        setIsLoading(false)
      }
    },
    [navigate, clearAuthData],
  )
  const logout = useCallback(() => {
    setIsLoading(true)
    authService
      .logout()
      .then(() => {
        clearAuthData()
        navigate("/")
      })
      .catch((err) => {
        console.error("Logout failed:", err)
        // Even if logout API fails, clear local data
        clearAuthData()
        navigate("/")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [navigate, clearAuthData])

  // Add this function before the authContextValue declaration
  const updateProfilePicture = useCallback(
    (newProfilePicture: string) => {
      if (user) {
        const updatedUser = { ...user, profilePicture: newProfilePicture }
        setUser(updatedUser)
        // Also update localStorage
        localStorage.setItem(USER_INFO, JSON.stringify(updatedUser))
        console.log("Profile picture updated in AuthContext:", newProfilePicture)

        // Dispatch custom event to notify other components
        window.dispatchEvent(
          new CustomEvent("profilePictureUpdated", {
            detail: { profilePicture: newProfilePicture, user: updatedUser },
          }),
        )

        // Force a state update to trigger re-renders
        setUser({ ...updatedUser })
      }
    },
    [user],
  )

  const authContextValue: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    refreshUserInfo,
    updateProfilePicture, // Add this line
    isLoading,
  }
  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}

// useAuth hook moved to useAuth.ts
