"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SignupForm } from "./components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        
        <AnimatePresence mode="wait">
          <Card className="w-full overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <SignupForm />
          </Card>
        </AnimatePresence>
      </div>
    </div>
  );
}