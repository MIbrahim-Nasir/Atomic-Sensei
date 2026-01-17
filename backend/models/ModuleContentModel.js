import mongoose from 'mongoose';

const youtubeVideoSchema = new mongoose.Schema({
  title: String,
  channel: String,
  description: String,
  url: String
});

const moduleContentSchema = new mongoose.Schema({
  // Topic field that matches with the topics in Module model
  topic: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Add details field
  details: {
    type: String,
    default: ''
  },
  level: {
    type: String,
    default: 'Beginner'
  },
  estimated_time: {
    type: String,
    default: '1-2 hours'
  },
  examples: {
    type: [String],
    default: []
  },
  related_concepts: {
    type: [String],
    default: []
  },
  other_resources: {
    type: [String],
    default: []
  },
  youtube_links: {
    type: [youtubeVideoSchema],
    default: []
  }
}, {
  timestamps: true
});

const ModuleContent = mongoose.model('ModuleContent', moduleContentSchema);

export default ModuleContent;