import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  course_title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  overallProgress: {
    type: Number,
    default: 0 // Percentage of completion
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;