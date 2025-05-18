import Roadmap from '../models/RoadmapModel.js';
import Module from '../models/ModuleModel.js';
import User from '../models/UserModel.js';

const roadmapController = {
  // Create a new roadmap for a user
  createRoadmap: async (req, res) => {
    try {
      const { course_title, description, duration, level, modules } = req.body;
      const userId = req.user._id;

      // Create modules first
      const moduleIds = [];
      for (const moduleData of modules) {
        const newModule = await Module.create({
          module_title: moduleData.module_title,
          topics: moduleData.topics
        });
        moduleIds.push(newModule._id);
      }

      // Create roadmap with module references
      const roadmap = await Roadmap.create({
        course_title,
        description,
        duration,
        level,
        modules: moduleIds
      });

      // Add roadmap to user
      await User.findByIdAndUpdate(userId, {
        $push: { roadmaps: roadmap._id }
      });

      res.status(201).json(roadmap);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all roadmaps for a user
  getUserRoadmaps: async (req, res) => {
    try {
      const userId = req.user._id;
      
      // Get user with populated roadmaps
      const user = await User.findById(userId)
        .populate({
          path: 'roadmaps',
          populate: {
            path: 'modules',
            model: 'Module'
          }
        });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(200).json(user.roadmaps);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific roadmap by ID
  getRoadmap: async (req, res) => {
    try {
      const roadmapId = req.params.id;
      const userId = req.user._id;
      
      // Verify the user has access to this roadmap
      const user = await User.findById(userId);
      if (!user.roadmaps.includes(roadmapId)) {
        return res.status(403).json({ error: 'Access denied to this roadmap' });
      }
      
      // Get the roadmap with populated modules
      const roadmap = await Roadmap.findById(roadmapId)
        .populate('modules');
      
      if (!roadmap) {
        return res.status(404).json({ error: 'Roadmap not found' });
      }
      
      res.status(200).json(roadmap);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update roadmap progress when a topic is completed
  updateTopicProgress: async (req, res) => {
    try {
      const { roadmapId, moduleId, topic } = req.body;
      const userId = req.user._id;
      
      // Verify the user has access to this roadmap
      const user = await User.findById(userId);
      if (!user.roadmaps.includes(roadmapId)) {
        return res.status(403).json({ error: 'Access denied to this roadmap' });
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
        const roadmap = await Roadmap.findById(roadmapId).populate('modules');
        let totalProgress = 0;
        roadmap.modules.forEach(mod => {
          totalProgress += mod.progress;
        });
        roadmap.overallProgress = totalProgress / roadmap.modules.length;
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
      res.status(500).json({ error: error.message });
    }
  },

  // Generate a new roadmap based on a template (like the JSON example)
  generateRoadmap: async (req, res) => {
    try {
      const { course_title, description, duration, level, modules } = req.body;
      const userId = req.user._id;
      
      // Create modules first
      const moduleIds = [];
      for (const moduleData of modules) {
        const newModule = await Module.create({
          module_title: moduleData.module_title,
          topics: moduleData.topics
        });
        moduleIds.push(newModule._id);
      }
      
      // Create roadmap with module references
      const roadmap = await Roadmap.create({
        course_title,
        description,
        duration,
        level,
        modules: moduleIds
      });
      
      // Add roadmap to user
      await User.findByIdAndUpdate(userId, {
        $push: { roadmaps: roadmap._id }
      });
      
      res.status(201).json({
        message: 'Roadmap generated successfully',
        roadmap: roadmap
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export default roadmapController;