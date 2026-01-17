"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { roadmapService } from '@/services/roadmap.service';
import { ModuleContentDialog } from '@/components/modules/ModuleContentDialog';
import { RoadmapHeader } from './RoadmapHeader';
import { ProgressOverview } from './ProgressOverview';
import { ModuleList } from './ModuleList';
import { ModuleContent } from './ModuleContent';

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
  moduleProgress: number;
  overallProgress: number;
}

export function RoadmapView({ roadmap, onBack }: RoadmapViewProps) {
  const [activeModule, setActiveModule] = useState<string | undefined>(roadmap?.modules?.[0]?._id);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({
    moduleProgress: Math.round(roadmap?.modules?.find(m => m._id === activeModule)?.progress || 0),
    overallProgress: Math.round(roadmap?.overallProgress || 0)
  });

  useEffect(() => {
    if (roadmap && activeModule) {
      const currentModule = roadmap.modules?.find(m => m._id === activeModule);
      setProgress(prev => ({
        ...prev,
        moduleProgress: Math.round(currentModule?.progress || 0)
      }));
    }
  }, [activeModule, roadmap]);

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

  const handleSelectModule = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  const handleMarkComplete = async (moduleId: string, topic: string) => {
    try {
      if (!roadmap?._id) return;
      
      // Call API to update progress
      const result = await roadmapService.updateTopicProgress(roadmap._id, moduleId, topic);
      console.log('Progress updated:', result);
      
      setProgress({
        moduleProgress: Math.round(result.moduleProgress), 
        overallProgress: Math.round(result.overallProgress)
      });
      
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
      <RoadmapHeader
        title={roadmap.course_title}
        description={roadmap.description}
        level={roadmap.level}
        duration={roadmap.duration}
        overallProgress={progress.overallProgress}
        onBack={onBack}
      />
      
      <ProgressOverview
        totalModules={totalModules}
        completedModules={completedModules}
      />

      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Course Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module List */}
            <ModuleList
              moduleProgress={progress.moduleProgress}
              modules={roadmap.modules || []}
              activeModuleId={activeModule}
              onSelectModule={handleSelectModule}
            />
            
            {/* Module Content */}
            <div className="col-span-1 md:col-span-2 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium text-gray-900">
                  {currentModule?.module_title || 'Select a module'}
                </h3>
              </div>
              
              <ModuleContent
                module={currentModule}
                moduleProgress={progress.moduleProgress}
                onTopicClick={handleTopicClick}
                onMarkComplete={handleMarkComplete}
              />
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