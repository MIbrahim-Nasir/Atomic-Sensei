"use client";

import { useState } from 'react';
import { GeneratedRoadmap } from '@/services/roadmap.service';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';

interface RoadmapViewProps {
  title: string;
  generatedRoadmap: GeneratedRoadmap;
  onBack: () => void;
}

export function RoadmapView({ title, generatedRoadmap, onBack }: RoadmapViewProps) {
  const [activeModule, setActiveModule] = useState<string | null>(Object.keys(generatedRoadmap)[0]);

  // Calculate total duration
  const totalDuration = Object.values(generatedRoadmap).reduce((total, module) => {
    const duration = module.duration.split(' ');
    const value = parseInt(duration[0]);
    const unit = duration[1];
    
    // Convert all to days for calculation
    let days = 0;
    if (unit.includes('week')) {
      days = value * 7;
    } else if (unit.includes('day')) {
      days = value;
    } else if (unit.includes('month')) {
      days = value * 30;
    }
    
    return total + days;
  }, 0);
  
  const totalModules = Object.keys(generatedRoadmap).length;
  const totalSubmodules = Object.values(generatedRoadmap).reduce(
    (total, module) => total + Object.keys(module.submodules).length, 0
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mb-2 text-gray-500 hover:text-gray-700 -ml-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Roadmaps
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              {totalModules} Modules
            </Badge>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
              {totalSubmodules} Topics
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
              <Clock className="mr-1 h-3 w-3" />
              {totalDuration} Days
            </Badge>
          </div>
        </div>
        
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
          <BookOpen className="mr-2 h-4 w-4" />
          Start Learning
        </Button>
      </div>
      
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardHeader>
          <CardTitle>Your Learning Path</CardTitle>
          <CardDescription>
            A personalized roadmap to help you master {title}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
            {/* Modules sidebar */}
            <div className="bg-gray-50 md:max-h-[600px] overflow-y-auto">
              <ul className="divide-y">
                {Object.entries(generatedRoadmap).map(([moduleKey, module], index) => (
                  <li key={moduleKey}>
                    <button
                      className={`w-full text-left px-4 py-3 flex items-center hover:bg-gray-100 transition-colors ${
                        activeModule === moduleKey ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                      onClick={() => setActiveModule(moduleKey)}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-1">
                          {module.title}
                        </h3>
                        <p className="text-xs text-gray-500">{module.duration}</p>
                      </div>
                      {activeModule === moduleKey && (
                        <ChevronRight className="h-5 w-5 text-blue-600" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Module content */}
            <div className="col-span-3 p-6 md:max-h-[600px] overflow-y-auto">
              {activeModule && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {generatedRoadmap[activeModule].title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{generatedRoadmap[activeModule].duration}</span>
                    </div>
                    <Progress 
                      value={0} 
                      className="h-2 mt-4 bg-gray-100" 
                    />
                    <p className="text-xs text-gray-500 mt-1">0% Complete</p>
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Submodules
                  </h3>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(generatedRoadmap[activeModule].submodules).map(([subKey, submodule], idx) => (
                      <AccordionItem 
                        key={subKey} 
                        value={subKey}
                        className="border border-gray-200 rounded-lg mb-3 overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs mr-3">
                              {idx + 1}
                            </div>
                            <div className="text-left">
                              <span className="font-medium">{submodule.title}</span>
                              <div className="text-xs text-gray-500 mt-0.5">{submodule.duration}</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 bg-gray-50">
                          <div className="pl-9">
                            <p className="text-gray-600 mb-3">
                              Content for this submodule will be available when you start the course.
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <BookOpen className="mr-1 h-3 w-3" />
                              Preview Content
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}