import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  academicYear: {
    type: Number,
    enum: [1, 2],
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['CORE', 'ELECTIVE'],
    required: true
  },
  type: {
    type: String,
    enum: ['THEORY', 'LAB'],
    required: true
  },
  totalHours: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);
