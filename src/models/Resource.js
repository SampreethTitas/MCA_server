import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['CLASSROOM', 'LAB'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
