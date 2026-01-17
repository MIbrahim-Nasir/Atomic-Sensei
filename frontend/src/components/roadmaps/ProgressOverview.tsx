import { Card } from '@/components/ui/card';
import { BookOpen, CheckCircle, Play } from 'lucide-react';

interface ProgressOverviewProps {
  totalModules: number;
  completedModules: number;
}

export function ProgressOverview({ totalModules, completedModules }: ProgressOverviewProps) {
  return (
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
  );
}