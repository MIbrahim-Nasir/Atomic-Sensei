// Roadmap service for frontend

interface Module {
  _id: string;
  module_title: string;
  description: string;
  topics: string[];
  completedTopics: string[];
  progress: number;
}

export interface Roadmap {
  _id: string;
  course_title: string;
  description: string;
  duration?: string;
  level?: string;
  overallProgress: number;
  modules: Module[];
  user: string;
  createdAt: string;
  updatedAt: string;
}

class RoadmapService {
  /**
   * Get all roadmaps for the current user
   */
  async getRoadmaps(): Promise<Roadmap[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/roadmap', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roadmaps');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      return [];
    }
  }

  /**
   * Get a specific roadmap by ID
   */
  async getRoadmap(id: string): Promise<Roadmap | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:5000/api/roadmap/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roadmap');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching roadmap ${id}:`, error);
      return null;
    }
  }

  /**
   * Create a new roadmap
   */
  async createRoadmap(data: { 
    course_title: string; 
    resources: string;
    profile: {
      age: string | number;
      current_education: string;
      current_knowledge: string;
    }
  }): Promise<Roadmap | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create roadmap');
      }

      const responseData = await response.json();
      return responseData.roadmap;
    } catch (error) {
      console.error('Error creating roadmap:', error);
      throw error;
    }
  }

  /**
   * Update topic progress
   */
  async updateTopicProgress(roadmapId: string, moduleId: string, topic: string): Promise<{ moduleProgress: number; overallProgress: number }> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/roadmap/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roadmapId,
          moduleId,
          topic
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }
}

export const roadmapService = new RoadmapService();