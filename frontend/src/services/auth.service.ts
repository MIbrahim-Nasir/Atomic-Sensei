// Authentication service for frontend

interface User {
  _id: string;
  username: string;
  email: string;
  age?: number;
  educationLevel?: string;
  currentKnowledge?: string;
  token?: string;
}

import { clientUtils } from '@/lib/client-utils';

class AuthService {
  /**
   * Sign in user
   */
  async signin(email: string, password: string): Promise<User> {
    try {
      // Trim and validate inputs
      const trimmedEmail = email?.trim();
      const trimmedPassword = password?.trim();
      
      if (!trimmedEmail || !trimmedPassword) {
        throw new Error('Email and password are required');
      }
      
      console.log('Attempting signin with:', { email: trimmedEmail });
      
      const response = await fetch('http://localhost:5000/api/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: trimmedEmail, 
          password: trimmedPassword 
        })
      });

      // Important: Handle different response statuses properly
      if (!response.ok) {
        // Try to parse response body, but handle empty responses
        let errorMessage = 'Failed to sign in';
        
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          } else if (response.status === 401) {
            errorMessage = 'Invalid email or password';
          }
        } catch (parseError) {
          // If JSON parsing fails (empty body), use status-based message
          if (response.status === 401) {
            errorMessage = 'Invalid email or password';
          } else if (response.status === 400) {
            errorMessage = 'All fields must be filled';
          }
        }
        
        console.error('Login failed with status:', response.status);
        throw new Error(errorMessage);
      }

      // Parse the successful response
      let userData;
      try {
        userData = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }
      
      // Validate the response contains what we need
      if (!userData || !userData.token) {
        throw new Error('Invalid response format');
      }
      
      // Store token and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user || userData));
      }
      
      console.log('Login successful');
      return userData.user || userData;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign up user
   */
  async signup(userData: {
    username: string;
    password: string;
    email: string;
    age?: number;
    educationLevel?: string;
    currentKnowledge: string;
  }): Promise<User> {
    try {
      const response = await fetch('http://localhost:5000/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign up');
      }

      const user = await response.json();
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign out user
   */
  signout(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Get the current logged in user
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get user token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Refresh user profile from server
   */
  async refreshUserProfile(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch('http://localhost:5000/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      
      // Update stored user data
      userData.token = token; // Keep the existing token
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: {
    email?: string;
    age?: number;
    educationLevel?: string;
    preferredContentType?: string;
  }): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update stored user data
      updatedUser.token = token; // Keep the existing token
      
      // This condition is inverted! It should be checking if window IS defined
      // Current code: if (typeof window !== 'undefined') return null;
      // Fixed code:
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
