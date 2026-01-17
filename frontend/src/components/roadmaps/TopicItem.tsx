import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface TopicItemProps {
  topic: string;
  isCompleted: boolean;
  moduleId: string;
  onTopicClick: (topic: string) => void;
  onMarkComplete: (moduleId: string, topic: string) => void;
}

export function TopicItem({ 
  topic,
  moduleId, 
  onTopicClick, 
  onMarkComplete 
}: TopicItemProps) {

    const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div className="flex items-start justify-between bg-gray-50 rounded-lg p-3">
      <div 
        className="flex items-start flex-1 cursor-pointer" 
        onClick={() => onTopicClick(topic)}
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
            onMarkComplete(moduleId, topic);
            setIsCompleted(true); // Update local state to reflect completion
          }}
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          Mark Complete
        </Button>
      )}
    </div>
  );
}