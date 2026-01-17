import axios from 'axios';
import ModuleContent from '../models/ModuleContentModel.js';
import Module from '../models/ModuleModel.js';

const moduleContentController = {
  // Generate content for a specific topic
  generateContent: async (req, res) => {
    try {
      const { topic } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }

      // Check if content already exists in database
      const existingContent = await ModuleContent.findOne({ topic });
      
      if (existingContent) {
        return res.status(200).json({
          message: 'Content retrieved from database',
          content: existingContent
        });
      }
      
      // Call external API to generate content
      const response = await axios.post('http://13.221.1.168/api/generate-content', {
        topic
      });
      
      if (!response.data) {
        throw new Error('Invalid response from content generation API');
      }
      
      // Store content in database
      const newContent = await ModuleContent.create({
        topic,
        title: response.data.content.title,
        description: response.data.content.description,
        details: response.data.content.details || '',
        level: response.data.content.level,
        estimated_time: response.data.content.estimated_time,
        examples: response.data.content.examples,
        related_concepts: response.data.content.related_concepts,
        other_resources: response.data.other_resources,
        youtube_links: response.data.youtube_links
      });
      
      res.status(201).json({
        message: 'Content generated successfully',
        content: newContent
      });
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(error.response?.status || 500).json({ 
        error: error.message || 'Failed to generate content'
      });
    }
  },
  
  // Get content for a specific topic
  getContent: async (req, res) => {
    try {
      const { topic } = req.params;
      
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }
      
      const content = await ModuleContent.findOne({ 
        topic: decodeURIComponent(topic) 
      });
      
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      res.status(200).json(content);
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default moduleContentController;