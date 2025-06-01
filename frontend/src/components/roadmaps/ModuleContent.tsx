import { TopicsList } from './TopicsList';

interface Module {
  _id: string;
  module_title: string;
  progress: number;
  topics?: string[];
  completedTopics?: string[];
}

interface ModuleContentProps {
  module: Module | undefined;
  moduleProgress: number;
  onTopicClick: (topic: string) => void;
  onMarkComplete: (moduleId: string, topic: string) => void;
}

export function ModuleContent({ 
  module, 
  moduleProgress, 
  onTopicClick, 
  onMarkComplete 
}: ModuleContentProps) {
  if (!module) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please select a module to view its content
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Module Progress</span>
          <span className="text-sm font-medium text-blue-600">
            {moduleProgress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${moduleProgress}%` }}
          ></div>
        </div>
      </div>
      
      <TopicsList
        moduleId={module._id}
        topics={module.topics || []}
        completedTopics={module.completedTopics || []}
        onTopicClick={onTopicClick}
        onMarkComplete={onMarkComplete}
      />
    </div>
  );
}