"use client";

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface Module {
  _id: string;
  module_title: string;
  topics: string[];
}

interface RoadmapProps {
  roadmap: {
    _id: string;
    course_title: string;
    description: string;
    overallProgress: number;
    modules?: Module[];
  };
}

export default function RoadmapCard({ roadmap }: RoadmapProps) {
  // Extract topics from all modules to display as tags
  const allTopics = roadmap.modules?.flatMap(module => module.topics) || [];
  const displayTopics = [...new Set(allTopics)].slice(0, 3); // Show only first 3 unique topics

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900">{roadmap.course_title}</h3>
        <p className="mt-1 text-sm text-gray-500">{roadmap.description}</p>
        
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {roadmap.overallProgress || 0}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
              <div
                style={{ width: `${roadmap.overallProgress || 0}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>
        </div>
        
        {displayTopics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {displayTopics.map((topic, index) => (
              <span 
                key={index} 
                className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
              >
                {topic}
              </span>
            ))}
            {allTopics.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
                +{allTopics.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-5 py-3 flex justify-end">
        <Link
          href={`/dashboard/roadmaps/${roadmap._id}`}
          className="text-sm font-medium text-blue-600 flex items-center hover:text-blue-500"
        >
          View roadmap 
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}