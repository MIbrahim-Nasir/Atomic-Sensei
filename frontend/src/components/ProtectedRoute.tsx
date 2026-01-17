'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';

interface User {
  _id: string;
  username: string;
  email: string;
  age: number;
  educationLevel: string;
  // Add other user properties as needed
}

export default function ProtectedRoute({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Function to verify token and get user data
    const verifyAuth = async () => {
      setIsLoading(true);
      
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (mounted) {
      verifyAuth();
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router, mounted]);

  // Don't render anything during SSR or loading
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-b-blue-600 border-l-blue-100 border-r-blue-100 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
}