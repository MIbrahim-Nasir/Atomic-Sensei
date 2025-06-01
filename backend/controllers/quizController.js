import axios from 'axios';
import Quiz from '../models/QuizModel.js';

const quizController = {
  // Generate a quiz for a specific topic
  generateQuiz: async (req, res) => {
    try {
      const { topic } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }

      // Check if quiz already exists in database
      const existingQuiz = await Quiz.findOne({ topic });
      
      if (existingQuiz) {
        return res.status(200).json({
          message: 'Quiz retrieved from database',
          quiz: existingQuiz
        });
      }
      
      // Call external API to generate quiz
      const response = await axios.post('http://13.221.1.168/api/generate-quiz', {
        topic
      });
      
      if (!response.data) {
        throw new Error('Invalid response from quiz generation API');
      }
      
      // Store quiz in database
      const newQuiz = await Quiz.create({
        topic,
        title: response.data.title,
        description: response.data.description,
        questions: response.data.questions
      });
      
      res.status(201).json({
        message: 'Quiz generated successfully',
        quiz: newQuiz
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      res.status(error.response?.status || 500).json({ 
        error: error.message || 'Failed to generate quiz'
      });
    }
  },
  
  // Get a quiz for a specific topic
  getQuiz: async (req, res) => {
    try {
      const { topic } = req.params;
      
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }
      
      const quiz = await Quiz.findOne({ 
        topic: decodeURIComponent(topic) 
      });
      
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      
      res.status(200).json(quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default quizController;