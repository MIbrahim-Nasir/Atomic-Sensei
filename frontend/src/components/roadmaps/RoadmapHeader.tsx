import { ArrowLeft, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RoadmapHeaderProps {
  title: string;
  description: string;
  level?: string;
  duration?: string;
  overallProgress: number;
  onBack: () => void;
}

export function RoadmapHeader({
  title,
  description,
  level,
  duration,
  overallProgress,
  onBack
}: RoadmapHeaderProps) {
  return (
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
        
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-gray-600">{description}</p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {level && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {level}
            </Badge>
          )}
          {duration && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Clock className="mr-1 h-3 w-3" />
              {duration}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">Overall Progress</p>
          <p className="text-xl font-bold text-blue-600">{overallProgress}%</p>
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
              strokeDashoffset={2 * Math.PI * 18 * (1 - overallProgress / 100)}
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
  );
}