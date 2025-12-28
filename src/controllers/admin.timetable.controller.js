import Timetable from '../models/Timetable.js';
import Subject from '../models/Subject.js';
import Batch from '../models/Batch.js';
import Resource from '../models/Resource.js';



const validateSessions = async (sessions) => {
  const usedRooms = new Set();
  const usedFaculty = new Set();
  const usedBatches = new Set();

  for (const s of sessions) {
    if (usedRooms.has(String(s.room)))
      throw new Error('Room clash in same slot');

    if (usedFaculty.has(String(s.faculty)))
      throw new Error('Faculty clash in same slot');

    if (s.batch) {
      if (usedBatches.has(String(s.batch)))
        throw new Error('Batch assigned twice in same slot');

      const batch = await Batch.findById(s.batch);
      const room = await Resource.findById(s.room);

      if (!batch || !room) {
        throw new Error('Invalid batch or room');
      }

      if (batch.size > room.capacity) {
        throw new Error(
          `${batch.name} exceeds capacity of ${room.roomCode}`
        );
      }

      usedBatches.add(String(s.batch));
    }

    usedRooms.add(String(s.room));
    usedFaculty.add(String(s.faculty));
  }
};

export const createTimetableEntry = async (req, res) => {
  try {
    const {
      subject, faculty, room,
      academicYear, semester,
      day, period, section, batch, type
    } = req.body;

    // 1️⃣ Faculty clash
    const facultyClash = await Timetable.findOne({ faculty, day, period });
    if (facultyClash) {
      return res.status(400).json({ message: 'Faculty already assigned in this slot' });
    }

    // 2️⃣ Room clash
    const roomClash = await Timetable.findOne({ room, day, period });
    if (roomClash) {
      return res.status(400).json({ message: 'Room already occupied in this slot' });
    }

    // 3️⃣ Subject hour check
    const subjectDoc = await Subject.findById(subject);
    const usedHours = await Timetable.countDocuments({ subject });
    if (usedHours >= subjectDoc.totalHours) {
      return res.status(400).json({ message: 'Subject lecture hours already completed' });
    }

    // 4️⃣ Section rule
    if (type === 'CORE' && !section) {
      return res.status(400).json({ message: 'Section is required for core subjects' });
    }

    if (type === 'ELECTIVE' && section) {
      return res.status(400).json({ message: 'Elective subjects should not have section' });
    }

    


    const entry = await Timetable.create(req.body);
    res.status(201).json(entry);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// export const getTimetable = async (req, res) => {
//   const data = await Timetable.find()
//     .populate('subject', 'subjectCode name')
//     .populate('faculty', 'name')
//     .populate('room', 'roomCode');

//   res.json(data);
// };

export const getTimetable = async (req, res) => {
  const { academicYear, semester, section } = req.query;

  const slots = await Timetable.find({
    academicYear,
    semester,
    section
  })
    .populate('sessions.subject', 'subjectCode name')
    .populate('sessions.faculty', 'name')
    .populate('sessions.room', 'roomCode')
    .populate('sessions.batch', 'name');

  // 🔧 NORMALIZATION STEP (CRITICAL)
  const normalized = slots.map(slot => {
    // If sessions already exist (new model)
    if (slot.sessions && slot.sessions.length > 0) {
      return slot;
    }

    // 🔁 Backward compatibility for old theory entries
    if (slot.subject && slot.faculty && slot.room) {
      return {
        ...slot.toObject(),
        sessions: [
          {
            subject: slot.subject,
            faculty: slot.faculty,
            room: slot.room,
            batch: null
          }
        ]
      };
    }

    return slot;
  });

  res.json(normalized);
};


export const updateTimetableEntry = async (req, res) => {
  try {
    const updated = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const upsertTimetableSlot = async (req, res) => {
  try {
    const {
      academicYear,
      semester,
      section,
      day,
      period,
      sessions,
      isContinuous
    } = req.body;

    if (!sessions || sessions.length === 0) {
      return res.status(400).json({ message: 'At least one session required' });
    }

    // Validate current slot
    await validateSessions(sessions);

    // Save first period
    await Timetable.findOneAndUpdate(
      { academicYear, semester, section, day, period },
      { sessions },
      { upsert: true, new: true }
    );

    // Save next period if continuous
    if (isContinuous) {
      const nextPeriod = Number(period) + 1;

      if (nextPeriod > 6) {
        return res.status(400).json({
          message: 'Continuous lab exceeds day period limit'
        });
      }

      await validateSessions(sessions);

      await Timetable.findOneAndUpdate(
        { academicYear, semester, section, day, period: nextPeriod },
        { sessions },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Timetable slot saved successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

