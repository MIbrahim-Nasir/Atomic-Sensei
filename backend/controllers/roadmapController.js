import Roadmap from '../models/RoadmapModel.js';
import Module from '../models/ModuleModel.js';
import User from '../models/UserModel.js';
import axios from 'axios';

const roadmapController = {
  // Create a new roadmap for a user by calling the AI API
  createRoadmap: async (req, res) => {
    try {
      const { course_title, resources, profile } = req.body;
      const userId = req.user._id;

      if (!course_title) {
        return res.status(400).json({ error: 'Course title is required' });
      }

      // Call the external AI API to generate the roadmap
      const response = await axios.post('http://13.221.1.168/api/generate-roadmap', {
        course_title,
        profile: profile || {
          age: "",
          current_education: "",
          current_knowledge: ""
        }
      });

      if (!response.data) {
        throw new Error('Invalid response from roadmap generation API');
      }

      const roadmapData = response.data;

      // Transform the response into our module structure
      const modulePromises = [];
      
      // Extract modules from the response
      for (let i = 1; i <= 10; i++) {
        const moduleKey = `module_${i}`;
        if (roadmapData[moduleKey]) {
          const moduleData = roadmapData[moduleKey];
          const topics = [];
          
          // Extract topics from sub_modules
          if (moduleData.sub_modules) {
            for (let j = 1; j <= 10; j++) {
              const subModuleKey = `sub_module_${j}`;
              if (moduleData.sub_modules[subModuleKey]) {
                topics.push(moduleData.sub_modules[subModuleKey].title);
              }
            }
          }
          
          // Create a module in the database
          const modulePromise = Module.create({
            module_title: moduleData.title,
            description: `Duration: ${moduleData.duration || 'Not specified'}`,
            topics: topics,
            completedTopics: [],
            progress: 0
          });
          
          modulePromises.push(modulePromise);
        }
      }
      
      // Wait for all modules to be created
      const modules = await Promise.all(modulePromises);
      const moduleIds = modules.map(module => module._id);

      // Create roadmap with module references
      const roadmap = await Roadmap.create({
        course_title: roadmapData.course_title || course_title,
        description: roadmapData.description || `Learning path for ${course_title}`,
        duration: roadmapData.duration || 'Self-paced',
        level: roadmapData.level || 'Beginner',
        modules: moduleIds,
        overallProgress: 0,
        user: userId
      });

      // Add roadmap to user's roadmaps
      await User.findByIdAndUpdate(userId, {
        $push: { roadmaps: roadmap._id }
      });

      // Return the created roadmap with populated modules
      const populatedRoadmap = await Roadmap.findById(roadmap._id).populate('modules');

      res.status(201).json({
        message: 'Roadmap created successfully',
        roadmap: populatedRoadmap
      });
    } catch (error) {
      console.error('Error creating roadmap:', error);
      res.status(error.response?.status || 500).json({ 
        error: error.message || 'Failed to create roadmap'
      });
    }
  },

  // Get all roadmaps for a user
  getUserRoadmaps: async (req, res) => {
    try {
      const userId = req.user._id;
      
      // Get user's roadmaps with populated modules
      const roadmaps = await Roadmap.find({ user: userId })
        .populate('modules')
        .sort({ createdAt: -1 });
      
      res.status(200).json(roadmaps);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific roadmap by ID
  getRoadmap: async (req, res) => {
    try {
      const roadmapId = req.params.id;
      const userId = req.user._id;
      
      // Get the roadmap with populated modules
      const roadmap = await Roadmap.findOne({ 
        _id: roadmapId,
        user: userId
      }).populate('modules');
      
      if (!roadmap) {
        return res.status(404).json({ error: 'Roadmap not found' });
      }
      
      res.status(200).json(roadmap);
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Update roadmap progress when a topic is completed
  updateTopicProgress: async (req, res) => {
    try {
      const { roadmapId, moduleId, topic } = req.body;
      const userId = req.user._id;
      
      // Verify user owns this roadmap
      const roadmap = await Roadmap.findOne({ _id: roadmapId, user: userId });
      if (!roadmap) {
        return res.status(404).json({ error: 'Roadmap not found' });
      }
      
      // Find the module
      const module = await Module.findById(moduleId);
      if (!module) {
        return res.status(404).json({ error: 'Module not found' });
      }
      
      // Check if topic exists in module
      if (!module.topics.includes(topic)) {
        return res.status(400).json({ error: 'Topic not found in module' });
      }
      
      // Add topic to completed topics if not already completed
      if (!module.completedTopics.includes(topic)) {
        module.completedTopics.push(topic);
        
        // Update module progress
        module.progress = (module.completedTopics.length / module.topics.length) * 100;
        await module.save();
        
        // Update overall roadmap progress
        const allModules = await Module.find({ _id: { $in: roadmap.modules } });
        let totalProgress = 0;
        allModules.forEach(mod => {
          totalProgress += mod.progress || 0;
        });
        roadmap.overallProgress = totalProgress / allModules.length;
        await roadmap.save();
        
        res.status(200).json({
          message: 'Progress updated successfully',
          moduleProgress: module.progress,
          overallProgress: roadmap.overallProgress
        });
      } else {
        res.status(200).json({ message: 'Topic already completed' });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default roadmapController;