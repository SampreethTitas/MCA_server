import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'FACULTY', 'STUDENT'],
    required: true
  },
  linkedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
