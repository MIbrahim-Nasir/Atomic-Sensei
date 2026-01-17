import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  course_title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  duration: {
    type: String,
    default: 'Self-paced'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'Beginner'
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;