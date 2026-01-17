import { ModuleItem } from "./ModuleItem";

interface Module {
  _id: string;
  module_title: string;
  progress: number;
}

interface ModuleListProps {
  modules: Module[];
  activeModuleId: string | undefined;
  onSelectModule: (moduleId: string) => void;
  moduleProgress: number;
}

export function ModuleList({ moduleProgress, modules, activeModuleId, onSelectModule }: ModuleListProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-medium text-gray-900">All Modules</h3>
      </div>
      
      <div className="divide-y">
        {modules?.map((module, index) => (
          <ModuleItem 
            key={module._id}
            index={index}
            activeModuleId={activeModuleId}
            onSelectModule={onSelectModule}
            module={module}
            moduleProgress={module.progress}
            />
        ))}
      </div>
    </div>
  );
}