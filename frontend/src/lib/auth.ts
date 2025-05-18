/**
 * Authentication utilities for working with JWT tokens
 */

interface User {
  _id: string;
  username: string;
  email: string;
  age: number;
  educationLevel: string;
  preferredContentType?: string;
  lastActive?: Date;
}

/**
 * Get the JWT token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Check if the user is authenticated (has a token)
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Remove the token from localStorage
 */
export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

/**
 * Save token to localStorage
 */
export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

/**
 * Get the current user from the API
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/user/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid or expired
        logoutUser();
      }
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
};
