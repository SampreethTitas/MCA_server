import Attendance from '../models/Attendance.js';
import Timetable from '../models/Timetable.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';


export const getFacultyTimetable = async (req, res) => {
  const faculty = await Faculty.findOne({ user: req.user.userId });
//console.log('req.user:', req.user);

  if (!faculty) {
    return res.status(404).json({ message: 'Faculty profile not found' });
  }

  const slots = await Timetable.find({
    'sessions.faculty': faculty._id
  })
    .populate('sessions.subject', 'subjectCode')
    .populate('sessions.room', 'roomCode')
    .populate('sessions.batch', 'name')
    .sort({ day: 1, period: 1 });

  res.json(slots);
};

export const getAttendanceSheet = async (req, res) => {
    
  const { timetableId, date } = req.query;

  const timetable = await Timetable.findById(timetableId)
    .populate('sessions.batch');

  if (!timetable) {
    return res.status(404).json({ message: 'Timetable slot not found' });
  }

  // Determine students list
  let students = [];

  if (timetable.sessions[0].batch) {
    // LAB → batch students
    students = await Student.find({
      batch: timetable.sessions[0].batch._id
    });
  } else {
    // THEORY → full section
    students = await Student.find({
      academicYear: timetable.academicYear,
      section: timetable.section
    });
  }

  // Existing attendance
  const records = await Attendance.find({
    timetable: timetableId,
    date
  });

  const attendanceMap = {};
  records.forEach(r => {
    attendanceMap[r.student.toString()] = r;
  });

  res.json({
    students,
    attendance: attendanceMap
  });
};


export const submitAttendance = async (req, res) => {
  const { timetableId, date, entries } = req.body;

  // entries = [{ studentId, status }]

  for (const e of entries) {
    await Attendance.findOneAndUpdate(
      {
        timetable: timetableId,
        student: e.studentId,
        date
      },
      {
        status: e.status
      },
      { upsert: true }
    );
  }

  res.json({ message: 'Attendance submitted and locked' });
};
