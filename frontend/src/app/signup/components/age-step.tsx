"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cake } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const ageSchema = z.object({
  age: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Age must be a number" })
    .refine((val) => Number(val) >= 5 && Number(val) <= 100, {
      message: "Age must be between 5 and 100",
    }),
});

interface AgeStepProps {
  name: string;
  initialAge?: number;
  onSubmit: (age: number) => void;
  onBack: () => void;
}

export function AgeStep({ name, initialAge, onSubmit, onBack }: AgeStepProps) {
  // Convert number to string for the form
  const initialAgeString = initialAge?.toString() || "";

  const form = useForm<z.infer<typeof ageSchema>>({
    resolver: zodResolver(ageSchema),
    defaultValues: {
      age: initialAgeString,
    },
  });

  // Make sure the form values are updated if initialAge changes
  useEffect(() => {
    form.reset({ age: initialAgeString });
  }, [initialAge, form]);

  const handleSubmit = (values: z.infer<typeof ageSchema>) => {
    onSubmit(Number(values.age));
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
            Almost there, {name}!
          </h1>
          <p className="text-slate-600">
            To personalize your learning experience, we need a little more information.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <Cake className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-slate-800">Your Age</h3>
          </div>

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={5}
                    max={100}
                    placeholder="e.g. 25"
                    className="w-full p-3 border-blue-200 focus:border-blue-500 bg-blue-50/50 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
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
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Next
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}