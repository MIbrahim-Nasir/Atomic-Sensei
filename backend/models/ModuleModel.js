import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  module_title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  topics: {
    type: [String],
    default: []
  },
  completedTopics: {
    type: [String],
    default: []
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;