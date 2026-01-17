"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react";

interface KnowledgeStepProps {
  name: string;
  initialKnowledge: string;
  onSubmit: (currentKnowledge: string) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function KnowledgeStep({ name, initialKnowledge, onSubmit, onBack, isSubmitting = false }: KnowledgeStepProps) {
  const [knowledge, setKnowledge] = useState(initialKnowledge || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (knowledge.length < 10) {
      setError("Please provide at least 10 characters");
      return;
    }
    
    onSubmit(knowledge);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Final step, {name}!
        </h1>
        <p className="text-slate-600">
          Tell us about your current knowledge areas or what you&apos;re interested in learning
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <BookOpen className="h-6 w-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-slate-800">Your Knowledge & Interests</h3>
        </div>
        
        <div>
          <textarea
            value={knowledge}
            onChange={(e) => {
              setKnowledge(e.target.value);
              if (e.target.value.length >= 10) {
                setError("");
              }
            }}
            placeholder="I know a bit about mathematics and physics, but I'm really interested in learning more about computer science and artificial intelligence..."
            className="w-full min-h-[128px] p-3 border-blue-200 focus:border-blue-500 bg-blue-50/50 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex justify-between"
      >
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete Signup"
          )}
        </Button>
      </motion.div>
    </form>
  );
}