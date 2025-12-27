import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    default: null
  }
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  academicYear: Number,
  semester: Number,
  section: String,
  day: String,
  period: Number,

  sessions: {
    type: [sessionSchema],
    required: true
  }
}, { timestamps: true });

timetableSchema.index(
  { academicYear: 1, semester: 1, section: 1, day: 1, period: 1 },
  { unique: true }
);

export default mongoose.model('Timetable', timetableSchema);
