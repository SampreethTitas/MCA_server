import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  usn: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  academicYear: { type: Number, enum: [1, 2], required: true },
  semester: { type: Number, required: true },
  section: { type: String, enum: ['A', 'B'], required: true },
  batch: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Batch',
  default: null
    },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
