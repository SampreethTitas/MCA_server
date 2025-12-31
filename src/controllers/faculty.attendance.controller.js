import Attendance from '../models/Attendance.js';
import Timetable from '../models/Timetable.js';
import Student from '../models/Student.js';

export const getAttendanceSheet = async (req, res) => {
  const { timetableId, date } = req.query;

  const timetable = await Timetable.findById(timetableId)
    .populate('sessions.batch');

  if (!timetable) {
    return res.status(404).json({ message: 'Timetable slot not found' });
  }

  let students = [];

  if (timetable.sessions[0].batch) {
    students = await Student.find({
      batch: timetable.sessions[0].batch._id
    });
  } else {
    students = await Student.find({
      academicYear: timetable.academicYear,
      section: timetable.section
    });
  }

  const records = await Attendance.find({
    timetable: timetableId,
    date
  });

  const attendanceMap = {};
  records.forEach(r => {
    attendanceMap[r.student.toString()] = r;
  });

  const locked = await Attendance.findOne({
  timetable: timetableId,
  date,
  isLocked: true
});

res.json({
  students,
  attendance: attendanceMap,
  isLocked: !!locked
});


};

export const submitAttendance = async (req, res) => {
  const { timetableId, date, entries } = req.body;

  // 🔒 Check if already locked
  const locked = await Attendance.findOne({
    timetable: timetableId,
    date,
    isLocked: true
  });

  if (locked) {
    return res.status(403).json({
      message: 'Attendance already submitted and locked'
    });
  }

  // Save attendance
  for (const e of entries) {
    await Attendance.findOneAndUpdate(
      {
        timetable: timetableId,
        student: e.studentId,
        date
      },
      {
        status: e.status,
        isLocked: true
      },
      { upsert: true }
    );
  }

  res.json({ message: 'Attendance submitted and locked' });
};
