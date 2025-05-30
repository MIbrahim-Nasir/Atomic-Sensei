"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, User, GraduationCap, Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const roadmapSchema = z.object({
  course_title: z.string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  profile: z.object({
    age: z.number()
      .min(10, { message: "Age must be at least 10" })
      .max(100, { message: "Age must be less than 100" }),
    current_education: z.string()
      .min(2, { message: "Education field is required" })
      .max(100, { message: "Education must be less than 100 characters" }),
    current_knowledge: z.string()
      .min(3, { message: "Please describe your current knowledge" })
      .max(500, { message: "Description must be less than 500 characters" })
  })
});

type RoadmapFormValues = z.infer<typeof roadmapSchema>;

interface CreateRoadmapFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoadmapFormValues) => Promise<void>;
}

export function CreateRoadmapForm({ isOpen, onClose, onSubmit }: CreateRoadmapFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RoadmapFormValues>({
    resolver: zodResolver(roadmapSchema),
    defaultValues: {
      course_title: "",
      profile: {
        age: 26,
        current_education: "",
        current_knowledge: ""
      }
    },
  });

  const handleSubmit = async (values: RoadmapFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      toast.success("Roadmap created successfully!");
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error creating roadmap:', error);
      toast.error("Failed to create roadmap. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg mx-auto p-0 pb-4 overflow-hidden bg-white rounded-xl shadow-xl border-0 max-h-[90vh] overflow-y-auto">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
        
        <DialogHeader className="px-6 pt-6 pb-4 text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Learning Roadmap
          </DialogTitle>
          
          <DialogDescription className="text-gray-600 text-sm">
            Tell us about yourself and what you'd like to learn for a personalized roadmap
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 pb-6 space-y-5">
            {/* Course Title */}
            <FormField
              control={form.control}
              name="course_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    What would you like to learn? *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                      <Input
                        placeholder="e.g., Python Programming for Beginners, React Development..."
                        className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 rounded-md"
                        autoFocus
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Profile Section */}
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2 text-indigo-500" />
                  Your Profile
                </h3>
              </div>

              {/* Age */}
              <FormField
                control={form.control}
                name="profile.age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Age *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-500" />
                        <Input
                          type="number"
                          placeholder="26"
                          className="pl-10 h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900 rounded-md"
                          disabled={isSubmitting}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Current Education */}
              <FormField
                control={form.control}
                name="profile.current_education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Current Education *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-500" />
                        <Input
                          placeholder="e.g., BE Computer Science, High School, Masters in..."
                          className="pl-10 h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900 rounded-md"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Current Knowledge */}
              <FormField
                control={form.control}
                name="profile.current_knowledge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Current Knowledge & Experience *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Brain className="absolute left-3 top-3 h-5 w-5 text-indigo-500" />
                        <Textarea
                          placeholder="e.g., I have basic knowledge of Python, completed online tutorials, worked on small projects..."
                          className="pl-10 pt-3 min-h-[90px] border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900 rounded-md resize-none"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md transition-all duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Roadmap...
                  </>
                ) : (
                  "Create Personalized Roadmap"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// In your dashboard page, update the handleCreateRoadmap function:
const handleCreateRoadmap = async (data: { 
  course_title: string; 
  profile: {
    age: number;
    current_education: string;
    current_knowledge: string;
  }
}) => {
  try {
    setIsCreateModalOpen(false);
    // Show loading state
    toast.loading('Generating your personalized roadmap...', { id: 'roadmap-loading' });
    
    const { roadmap, generatedContent } = await roadmapService.createRoadmap(data);
    
    // Update success state
    toast.success('Roadmap created successfully!', { id: 'roadmap-loading' });
    
    // Set the generated content and show the detailed view
    setGeneratedRoadmap(generatedContent);
    setNewRoadmapTitle(data.course_title);
    setShowGeneratedView(true);
    
    // Also update the roadmaps list with the new roadmap
    setRoadmaps(prev => [...prev, roadmap]);
  } catch (error) {
    console.error('Error creating roadmap:', error);
    toast.error('Failed to create roadmap. Please try again.', { id: 'roadmap-loading' });
    throw error;
  }
};