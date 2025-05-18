import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  module_title: {
    type: String,
    required: true
  },
  topics: {
    type: [String],
    required: true
  },
  progress: {
    type: Number,
    default: 0 // Percentage of completion
  },
  completedTopics: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const Module = mongoose.model('Module', moduleSchema);
export default Module;