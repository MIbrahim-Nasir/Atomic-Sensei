import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TopicItem } from './TopicItem';

interface TopicsListProps {
  moduleId: string;
  topics: string[];
  completedTopics: string[];
  onTopicClick: (topic: string) => void;
  onMarkComplete: (moduleId: string, topic: string) => void;
}

export function TopicsList({ 
  moduleId, 
  topics, 
  completedTopics, 
  onTopicClick, 
  onMarkComplete 
}: TopicsListProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="topics" className="border-none">
        <AccordionTrigger className="py-2 text-base font-medium text-gray-900">
          Topics in this module
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {topics?.length === 0 ? (
              <p className="text-gray-500 text-sm">No topics in this module</p>
            ) : (
              topics?.map((topic, index) => {
                const isCompleted = completedTopics?.includes(topic);
                
                return (
                  <TopicItem
                    key={index}
                    topic={topic}
                    isCompleted={isCompleted}
                    moduleId={moduleId}
                    onTopicClick={onTopicClick}
                    onMarkComplete={onMarkComplete}
                  />
                );
              })
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}