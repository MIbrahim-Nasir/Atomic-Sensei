import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    min: 5,
    max: 100
  },
  educationLevel: {
    type: String,
    enum: ['primary', 'middle', 'high', 'undergraduate', 'graduate', 'other'],
    default: 'other'
  },
  currentKnowledge: {
      type: String,
      required: true,
  },
  roadmaps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap'
  }],
  augmentation: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Static method for user signin
userSchema.statics.signin = async function(username, password) {
  if (!username || !password) {
    throw new Error('All fields must be filled');
  }

  const user = await this.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }

  return user;
};

// Static method for user signup
userSchema.statics.signup = async function(username, password, email, age, educationLevel, currentKnowledge) {
  // Validation
  if (!username || !password || !email || !currentKnowledge) {
    throw new Error('All required fields must be filled');
  }

  // Check if username already exists
  const usernameExists = await this.findOne({ username });
  if (usernameExists) {
    throw new Error('Username already exists');
  }

  // Check if email already exists
  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw new Error('Email already in use');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create user with currentKnowledge
  const user = await this.create({
    username,
    email,
    password: hash,
    age,
    educationLevel,
    currentKnowledge
  });

  return user;
};

// Static method for changing password
userSchema.statics.changePassword = async function(userId, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    throw new Error('All fields must be filled');
  }

  const user = await this.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  // Hash and update new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return true;
};

const User = mongoose.model('User', userSchema);
export default User;