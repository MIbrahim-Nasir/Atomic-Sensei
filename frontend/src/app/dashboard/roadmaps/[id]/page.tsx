"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RoadmapView } from '@/components/roadmaps/RoadmapView';
import { roadmapService } from '@/services/roadmap.service';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const data = await roadmapService.getRoadmap(params.id as string);
        if (data) {
          setRoadmap(data);
        } else {
          toast.error("Roadmap not found");
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching roadmap:', error);
        toast.error("Failed to load roadmap");
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRoadmap();
    }
  }, [params.id, router]);

  const handleBack = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading roadmap...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      <RoadmapView roadmap={roadmap} onBack={handleBack} />
    </div>
  );
}