"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { roadmapService } from '@/services/roadmap.service';
import { authService } from '@/services/auth.service';
import RoadmapCard from '@/components/dashboard/RoadmapCard';
import { CreateRoadmapForm } from '@/components/forms/CreateRoadmapForm';
import { 
  ChartBarIcon, 
  ClockIcon, 
  FireIcon, 
  BookOpenIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  if (typeof window !== 'undefined') {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
  }
  const [roadmaps, setRoadmaps] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const stats = [
    { name: 'Lessons Completed', value: '42', icon: BookOpenIcon, color: 'bg-blue-500', change: '+8% from last week' },
    { name: 'Study Hours', value: '28', icon: ClockIcon, color: 'bg-green-500', change: '+3 hours from last week' },
    { name: 'Current Streak', value: '7 days', icon: FireIcon, color: 'bg-orange-500', change: '' },
    { name: 'Quiz Score Avg', value: '85%', icon: ChartBarIcon, color: 'bg-purple-500', change: '+5% from last month' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUser(authService.getCurrentUser());
        const data = await roadmapService.getRoadmaps();
        setRoadmaps(data);
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateRoadmap = async (formData) => {
    try {
      await roadmapService.createRoadmap(formData);
      toast.success("Roadmap created successfully!");
      
      // Refresh roadmaps list
      const updatedRoadmaps = await roadmapService.getRoadmaps();
      setRoadmaps(updatedRoadmaps);
    } catch (error) {
      console.error('Error creating roadmap:', error);
      toast.error(error.message || 'Failed to create roadmap');
      throw error;
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Learner'}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your learning progress and continue your journey
          </p>
        </div>
        
        <Button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircleIcon className="mr-2 h-5 w-5" />
          New Roadmap
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                    {stat.change && (
                      <dd className="mt-1">
                        <div className="text-xs text-gray-500">{stat.change}</div>
                      </dd>
                    )}
                  </dl>
                </div>
              </div>
            </div>
            <div className={`h-1 ${stat.color}`} />
          </div>
        ))}
      </div>

      {/* Roadmaps Section */}
      <h2 className="text-lg font-medium text-gray-900 mb-4">Your Learning Roadmaps</h2>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your roadmaps...</p>
        </div>
      ) : roadmaps.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap._id} roadmap={roadmap} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">You don't have any roadmaps yet</h3>
          <p className="text-gray-500 mb-6">Create your first learning roadmap to get started</p>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            Create Roadmap
          </Button>
        </div>
      )}

      {/* Create Roadmap Form Dialog */}
      <CreateRoadmapForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateRoadmap}
      />
    </div>
  );
}