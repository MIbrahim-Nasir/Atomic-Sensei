"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EmailStep } from "./email-step";
import { PasswordStep } from "./password-step";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth";
import { useRouter } from 'next/navigation';

export type LoginData = {
  email: string;
  password: string;
};

type StepType = "email" | "password" | "authenticating";

function AnimatedStep({ 
  children, 
  isActive 
}: { 
  children: React.ReactNode; 
  isActive: boolean 
}) {
  if (!isActive) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<StepType>("email");
  const [loginData, setLoginData] = useState<Partial<LoginData>>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleEmailSubmit = (email: string) => {
    setLoginData({ ...loginData, email });
    setStep("password");
  };

  const handlePasswordSubmit = async (password: string) => {
    setStep("authenticating");
    const finalData = { ...loginData, password } as LoginData;
    setLoginError(null);
    
    try {
      // Direct fetch API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: finalData.email,
          password: finalData.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store token using the utility function
      if (data.token) {
        saveToken(data.token);
      }
      
      localStorage.setItem("token", data.token);
      
      // Show success message
      toast.success("Successfully logged in!");
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      console.error("Login error:", error);
      setLoginError(errorMessage);
      toast.error(errorMessage);
      setStep("password");
    }
  };

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-600"
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: step === "email" ? 0.5 : 1
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      
      <div className="p-6">
        <AnimatedStep isActive={step === "email"}>
          <EmailStep
            initialEmail={loginData.email || ""}
            onSubmit={handleEmailSubmit}
          />
        </AnimatedStep>

        <AnimatedStep isActive={step === "password"}>
          <PasswordStep
            email={loginData.email || ""}
            onSubmit={handlePasswordSubmit}
            onBack={() => setStep("email")}
            error={loginError}
          />
        </AnimatedStep>

        <AnimatedStep isActive={step === "authenticating"}>
          <div className="py-16 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-b-blue-600 border-l-blue-100 border-r-blue-100 animate-spin" />
              <h3 className="text-lg font-medium text-slate-700">Logging you in...</h3>
              <p className="text-sm text-slate-500">Just a moment while we verify your credentials</p>
            </motion.div>
          </div>
        </AnimatedStep>
      </div>
    </div>
  );
}