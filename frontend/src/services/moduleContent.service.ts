// Module content service for frontend

interface YoutubeVideo {
  title: string;
  channel: string;
  description: string;
  url: string;
}

export interface ModuleContent {
  _id: string;
  topic: string;
  title: string;
  description: string;
  details: string;
  level: string;
  estimated_time: string;
  examples: string[];
  related_concepts: string[];
  other_resources: string[];
  youtube_links: YoutubeVideo[];
  createdAt: string;
  updatedAt: string;
}

class ModuleContentService {
  
  async generateContent(topic: string): Promise<ModuleContent> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/module-content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  /**
   * Get content for a specific topic
   */
  async getContent(topic: string): Promise<ModuleContent | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:5000/api/module-content/${encodeURIComponent(topic)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching content for ${topic}:`, error);
      return null;
    }
  }
}

export const moduleContentService = new ModuleContentService();