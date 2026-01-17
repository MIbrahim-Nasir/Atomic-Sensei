"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";

const passwordSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordStepProps {
  email: string;
  onSubmit: (password: string) => void;
  onBack: () => void;
  error?: string | null;
}

export function PasswordStep({ email, onSubmit, onBack, error }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleSubmit = (values: PasswordFormValues) => {
    onSubmit(values.password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Enter Your Password
          </h1>
          <p className="text-slate-600">
            Welcome back! Please enter your password to continue
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-sm text-center text-slate-600 p-2 mb-4 bg-blue-50 rounded-lg">
            <p>Signing in as <span className="font-medium text-blue-700">{email}</span></p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 border-blue-200 focus:border-blue-500 bg-blue-50/50 text-lg rounded-lg"
                      autoComplete="current-password"
                      autoFocus
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-blue-500 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Login
            </Button>
          </div>
          
          <div className="text-center pt-2">
            <Button variant="link" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot password?
            </Button>
          </div>
        </motion.div>
      </form>
    </Form>
  );
}