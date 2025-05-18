'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
}

// Public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/', '/about'];

/**
 * Custom hook to check authentication status on navigation and login/signup events
 * @param onAuthChange Optional callback when auth status changes
 */
export function useAuthCheck(onAuthChange?: (state: AuthState) => void) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
  });
  
  const pathname = usePathname();
  const router = useRouter();

  // Function to check token
  const checkToken = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthState({ isAuthenticated: false, isLoading: false, userId: null });
        
        // Redirect to login if not on a public route
        if (!publicRoutes.includes(pathname) && pathname !== '/login') {
          router.push('/login');
        }
        return;
      }
      
      // Validate token with backend (optional but recommended)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/user/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setAuthState({ 
            isAuthenticated: true, 
            isLoading: false, 
            userId: userData._id || null
          });
        } else {
          // Invalid token
          localStorage.removeItem('token');
          setAuthState({ isAuthenticated: false, isLoading: false, userId: null });
          
          // Redirect if not on a public route
          if (!publicRoutes.includes(pathname)) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setAuthState({ isAuthenticated: false, isLoading: false, userId: null });
      }
      
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthState({ isAuthenticated: false, isLoading: false, userId: null });
    }
  };

  // Custom event for login/signup
  const handleAuthEvent = () => {
    checkToken();
  };

  useEffect(() => {
    // Check token on mount and route change
    checkToken();
    
    // Add custom event listeners for login/signup
    window.addEventListener('login-success', handleAuthEvent);
    window.addEventListener('signup-success', handleAuthEvent);
    window.addEventListener('logout', handleAuthEvent);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('login-success', handleAuthEvent);
      window.removeEventListener('signup-success', handleAuthEvent);
      window.removeEventListener('logout', handleAuthEvent);
    };
  }, [pathname]); // Re-run when route changes

  // Notify via callback if provided
  useEffect(() => {
    if (onAuthChange) {
      onAuthChange(authState);
    }
  }, [authState, onAuthChange]);

  return authState;
}