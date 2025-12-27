import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  academicYear: {
    type: Number,
    enum: [1, 2],
    required: true
  },
  section: {
    type: String,
    enum: ['A', 'B'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

batchSchema.index(
  { academicYear: 1, section: 1, name: 1 },
  { unique: true }
);

export default mongoose.model('Batch', batchSchema);
