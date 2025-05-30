// Mock roadmap service for frontend development

interface Submodule {
  title: string;
  duration: string;
}

interface Module {
  title: string;
  duration: string;
  submodules: Record<string, Submodule>;
}

export interface GeneratedRoadmap {
  [key: string]: Module;
}

interface ModuleOld {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'in-progress' | 'completed';
  progress: number;
}

export interface Roadmap {
  _id: string;
  title: string;
  description: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  progress: number;
  modules?: ModuleOld[];
  topics?: string[];
  image?: string;
}

interface CreateRoadmapInput {
  title: string;
  resources?: string;
}

// Mock data
const mockRoadmaps: Roadmap[] = [
  {
    _id: '1',
    title: 'AI Fundamentals',
    description: 'Learn the basic concepts and principles of artificial intelligence',
    tags: ['AI', 'Beginner', 'Recommended'],
    createdAt: new Date('2025-04-15'),
    updatedAt: new Date('2025-05-10'),
    progress: 65,
    modules: [
      {
        id: '101',
        title: 'Introduction to AI',
        description: 'Understanding what AI is and its basic concepts',
        status: 'completed',
        progress: 100,
      },
      {
        id: '102',
        title: 'Machine Learning Basics',
        description: 'Core machine learning principles and algorithms',
        status: 'in-progress',
        progress: 45,
      },
      {
        id: '103',
        title: 'Neural Networks',
        description: 'Understanding neural networks and deep learning',
        status: 'locked',
        progress: 0,
      }
    ],
    image: 'https://images.unsplash.com/photo-1677442135436-8da4d642b661?q=80&w=500&auto=format',
  },
  {
    _id: '2',
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis and visualization',
    tags: ['Python', 'Data Science', 'Beginner'],
    createdAt: new Date('2025-03-20'),
    updatedAt: new Date('2025-05-05'),
    progress: 32,
    modules: [
      {
        id: '201',
        title: 'Python Basics',
        description: 'Fundamentals of Python programming',
        status: 'completed',
        progress: 100,
      },
      {
        id: '202',
        title: 'Data Analysis with Pandas',
        description: 'Using Pandas for efficient data manipulation',
        status: 'in-progress',
        progress: 30,
      },
      {
        id: '203',
        title: 'Data Visualization',
        description: 'Creating insightful visualizations with Matplotlib and Seaborn',
        status: 'locked',
        progress: 0,
      }
    ],
    image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcb970?q=80&w=500&auto=format',
  },
  {
    _id: '3',
    title: 'Advanced Machine Learning',
    description: 'Deep dive into advanced machine learning techniques and algorithms',
    tags: ['ML', 'Advanced', 'Algorithms'],
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-05-12'),
    progress: 15,
    modules: [
      {
        id: '301',
        title: 'Supervised Learning Advanced',
        description: 'Advanced techniques in supervised learning',
        status: 'in-progress',
        progress: 40,
      },
      {
        id: '302',
        title: 'Unsupervised Learning',
        description: 'Clustering, dimensionality reduction and more',
        status: 'locked',
        progress: 0,
      },
      {
        id: '303',
        title: 'Reinforcement Learning',
        description: 'Learning from environment interactions',
        status: 'locked',
        progress: 0,
      }
    ],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=500&auto=format',
  }
];

class RoadmapService {
  /**
   * Get all roadmaps for the current user
   */
  async getRoadmaps(): Promise<Roadmap[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return []||[
      {
        _id: "1",
        title: "Machine Learning Fundamentals",
        description: "Learn the core concepts of machine learning algorithms",
        progress: 65,
        topics: ["Supervised Learning", "Neural Networks", "Data Preprocessing"]
      },
      {
        _id: "2",
        title: "Deep Learning Specialization",
        description: "Dive deep into neural networks and deep learning architectures",
        progress: 25,
        topics: ["CNN", "RNN", "Transformers"]
      },
      {
        _id: "3",
        title: "AI Ethics",
        description: "Understand the ethical implications of AI and responsible deployment",
        progress: 90,
        topics: ["Bias", "Transparency", "Accountability"]
      }
    ];
  }

  /**
   * Create a new roadmap based on the user's input
   * @param data Object containing title and optional resources
   * @returns The newly created roadmap and its structured format
   */
  async createRoadmap(data: CreateRoadmapInput): Promise<{roadmap: Roadmap, generatedContent: GeneratedRoadmap}> {
    try {
      // Get the authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      console.log('Creating roadmap with data:', data);
      // Make the API call to generate roadmap
      const response = await fetch('http://13.221.1.168/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create roadmap: ${response.status}`);
      }

      // Get the generated content (module structure)
      const generatedContent: GeneratedRoadmap = await response.json();
      
      // For testing, you can use this mock data if API is not ready
      // const generatedContent: GeneratedRoadmap = this.getMockRoadmapData(data.title);
      
      // Create a roadmap object based on the generated content
      const topics: string[] = [];
      
      Object.values(generatedContent).forEach(module => {
        topics.push(module.title);
      });
      
      const roadmap: Roadmap = {
        _id: Date.now().toString(), // Temporary ID until backend assigns one
        title: data.title,
        description: `A personalized learning roadmap for ${data.title}`,
        tags: ['Generated', 'Personalized'],
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: 0, // Initial progress
        topics: topics.slice(0, 3), // Just show first 3 topics as preview
        image: `https://source.unsplash.com/random/800x600?${encodeURIComponent(data.title)}`,
      };
      
      return { roadmap, generatedContent };
    } catch (error) {
      console.error('Error creating roadmap:', error);
      throw error;
    }
  }
  
  // Optional: Mock data for testing without API
  private getMockRoadmapData(title: string): GeneratedRoadmap {
    return {
      "module-1": {
        "title": "Python Fundamentals",
        "duration": "2 weeks",
        "submodules": {
          "submodule-1": {
            "title": "Introduction to Python and Setup",
            "duration": "3 days"
          },
          "submodule-2": {
            "title": "Data Types, Variables, and Operators",
            "duration": "4 days"
          },
          "submodule-3": {
            "title": "Control Flow: Conditionals and Loops",
            "duration": "3 days"
          }
        }
      },
      "module-2": {
        "title": "Data Structures and Functions",
        "duration": "3 weeks",
        "submodules": {
          "submodule-1": {
            "title": "Lists and Tuples",
            "duration": "5 days"
          },
          "submodule-2": {
            "title": "Dictionaries and Sets",
            "duration": "4 days"
          },
          "submodule-3": {
            "title": "Functions and Modules",
            "duration": "5 days"
          }
        }
      }
    };
  }
}

export const roadmapService = new RoadmapService();
