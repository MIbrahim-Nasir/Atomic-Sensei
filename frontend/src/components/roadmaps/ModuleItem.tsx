import { ChevronRight } from 'lucide-react';
import { useState } from 'react';



export function ModuleItem({
  module,
  activeModuleId,
  onSelectModule,
  index
}: {
  module: { _id: string; module_title: string; progress: number };
  activeModuleId?: string;
  onSelectModule: (moduleId: string) => void;
}) {

    const [moduleProgress, setModuleProgress] = useState<number>(Math.round(module.progress || 0));

  return (
    <button
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
            module._id === activeModuleId 
            ? 'bg-blue-50' 
            : 'hover:bg-gray-50'
        }`}
        onClick={() => onSelectModule(module._id)}
        >
        <div className="flex items-center">
            <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3">
            {index + 1}
            </div>
            <div className="text-sm font-medium text-gray-900 line-clamp-1">{module.module_title}</div>
        </div>
        
        <div className="flex items-center">
            <span className="text-xs font-medium text-gray-500 mr-2">
            {Math.round(moduleProgress)}%
            </span>
            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
            module._id === activeModuleId ? 'transform rotate-90' : ''
            }`} />
        </div>
    </button>
  );
}