"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Link as LinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';

interface FormData {
  course_title: string;
  resources: string;
}

interface CreateRoadmapFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData & { profile: any }) => Promise<void>;
}

export function CreateRoadmapForm({ isOpen, onClose, onSubmit }: CreateRoadmapFormProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    course_title: '',
    resources: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.course_title.trim()) {
      toast.error('Course title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get user profile from auth service
      const user = authService.getCurrentUser();
      
      if (!user) {
        throw new Error('User profile not found. Please log in again.');
      }
      
      // Get profile data from user object
      const profile = {
        age: user.age || '',
        current_education: user.educationLevel || '',
        current_knowledge: user.currentKnowledge || ''
      };
      
      // Submit with both form data and profile
      await onSubmit({
        ...formData,
        profile
      });
      
      toast.success("Roadmap created successfully!");
      setFormData({ 
        course_title: '',
        resources: ''
      });
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
      setFormData({ 
        course_title: '',
        resources: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden bg-white rounded-xl shadow-xl border-0">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
        
        <DialogHeader className="px-6 pt-6 pb-4 text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Learning Roadmap
          </DialogTitle>
          
          <DialogDescription className="text-gray-600 text-sm">
            Tell us what you'd like to learn and we'll create a personalized roadmap
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Course Title *
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
              <Input
                placeholder="e.g., Machine Learning, Web Development..."
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 rounded-md"
                value={formData.course_title}
                onChange={(e) => setFormData(prev => ({ ...prev, course_title: e.target.value }))}
                autoFocus
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Additional Resources <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
              <Textarea
                placeholder="Any specific resources you'd like to include..."
                className="pl-10 min-h-[80px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 rounded-md resize-none"
                value={formData.resources}
                onChange={(e) => setFormData(prev => ({ ...prev, resources: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Roadmap"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}