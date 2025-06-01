"use client";

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, BookOpen, ChevronRight, ArrowLeft, Play } from 'lucide-react';
import { toast } from 'sonner';
import { roadmapService } from '@/services/roadmap.service';
import { ModuleContentDialog } from '@/components/modules/ModuleContentDialog';

interface Topic {
  _id?: string;
  title?: string;
}

interface Module {
  _id: string;
  module_title: string;
  progress: number;
  topics?: string[];
  completedTopics?: string[];
}

interface Roadmap {
  _id: string;
  course_title: string;
  description: string;
  duration?: string;
  level?: string;
  overallProgress?: number;
  modules?: Module[];
}

interface RoadmapViewProps {
  roadmap: Roadmap | null;
  onBack: () => void;
}

interface ProgressState {
  moduleProgress: number; // Overall progress percentage
  overallProgress: number;
}

export function RoadmapView({ roadmap, onBack }: RoadmapViewProps) {
  const [activeModule, setActiveModule] = useState<string | undefined>(roadmap?.modules?.[0]?._id);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({moduleProgress:Math.round(roadmap?.overallProgress || 0),overallProgress:Math.round(roadmap?.overallProgress || 0)});

  useEffect(() => {

  }, [progress]);

  if (!roadmap) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Roadmap not found</h3>
        <p className="text-gray-500 mb-6">The roadmap you're looking for doesn't exist or has been removed.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const totalModules = roadmap.modules?.length || 0;
  const completedModules = roadmap.modules?.filter(module => module.progress === 100).length || 0;

  const currentModule = roadmap.modules?.find(module => module._id === activeModule);

  const handleMarkComplete = async (moduleId: string, topic: string) => {
    try {
      if (!roadmap?._id) return;
      
      // Call API to update progress
      const result = await roadmapService.updateTopicProgress(roadmap._id, moduleId, topic);
      console.log('Progress updated:', result);
      setProgress({moduleProgress: Math.round(result.moduleProgress), overallProgress: Math.round(result.overallProgress)});
      // Update the local state (Note: you'll need to manage state for this to work)
      // This is a placeholder for your state update logic
      toast.success('Topic marked as complete!');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    setIsContentDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mb-2 -ml-2 text-gray-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900">{roadmap.course_title}</h1>
          <p className="mt-1 text-gray-600">{roadmap.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {roadmap.level && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {roadmap.level}
              </Badge>
            )}
            {roadmap.duration && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Clock className="mr-1 h-3 w-3" />
                {roadmap.duration}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Overall Progress</p>
            <p className="text-xl font-bold text-blue-600">{progress.overallProgress}%</p>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-blue-100 bg-white">
            <svg className="w-12 h-12">
              <circle
                className="text-gray-200"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="18"
                cx="24"
                cy="24"
              />
              <circle
                className="text-blue-600"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - (roadmap.overallProgress || 0) / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="18"
                cx="24"
                cy="24"
              />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Progress Overview */}
      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-md p-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Modules</p>
                  <p className="text-xl font-bold text-gray-900">{totalModules}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-green-100 rounded-md p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-xl font-bold text-gray-900">{completedModules}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-amber-100 rounded-md p-2">
                  <Play className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <p className="text-xl font-bold text-gray-900">{totalModules - completedModules}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modules */}
      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Course Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module List */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium text-gray-900">All Modules</h3>
              </div>
              
              <div className="divide-y">
                {roadmap.modules?.map((module, index) => (
                  <button
                    key={module._id}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      module._id === activeModule 
                        ? 'bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveModule(module._id)}
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                        {index + 1}
                      </div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{module.module_title}</div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 mr-2">
                        {Math.round(module.progress)}%
                      </span>
                      <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                        module._id === activeModule ? 'transform rotate-90' : ''
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Module Content */}
            <div className="col-span-1 md:col-span-2 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium text-gray-900">
                  {currentModule?.module_title || 'Select a module'}
                </h3>
              </div>
              
              {currentModule ? (
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Module Progress</span>
                      <span className="text-sm font-medium text-blue-600">
                        {progress.moduleProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${currentModule.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="topics" className="border-none">
                      <AccordionTrigger className="py-2 text-base font-medium text-gray-900">
                        Topics in this module
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          {currentModule.topics?.length === 0 ? (
                            <p className="text-gray-500 text-sm">No topics in this module</p>
                          ) : (
                            currentModule.topics?.map((topic, index) => {
                              const isCompleted = currentModule.completedTopics?.includes(topic);
                              
                              return (
                                <div key={index} className="flex items-start justify-between bg-gray-50 rounded-lg p-3">
                                  <div 
                                    className="flex items-start flex-1 cursor-pointer" 
                                    onClick={() => handleTopicClick(topic)}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-0.5 mr-2 flex-shrink-0" />
                                    )}
                                    <div>
                                      <h4 className={`font-medium ${isCompleted ? 'text-gray-600' : 'text-gray-900'}`}>
                                        {topic}
                                      </h4>
                                    </div>
                                  </div>
                                  
                                  {!isCompleted && (
                                    <Button 
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent opening the dialog when clicking the button
                                        handleMarkComplete(currentModule._id, topic);
                                      }}
                                    >
                                      <CheckCircle className="mr-1 h-3 w-3" />
                                      Mark Complete
                                    </Button>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Please select a module to view its content
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {selectedTopic && (
        <ModuleContentDialog
          isOpen={isContentDialogOpen}
          topic={selectedTopic}
          onClose={() => setIsContentDialogOpen(false)}
        />
      )}
    </div>
  );
}