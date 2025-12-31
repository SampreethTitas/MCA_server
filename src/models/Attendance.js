import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  timetable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'OD'],
    default: 'ABSENT'
  },
  isLocked: {
  type: Boolean,
  default: false
  }

}, { timestamps: true });

attendanceSchema.index(
  { student: 1, timetable: 1, date: 1 },
  { unique: true }
);

export default mongoose.model('Attendance', attendanceSchema);
