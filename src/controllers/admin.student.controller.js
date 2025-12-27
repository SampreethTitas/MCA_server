import Student from '../models/Student.js';

export const createStudent = async (req, res) => {
    console.log(req.body);

  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// export const getStudents = async (req, res) => {
//   const students = await Student.find().sort({ usn: 1 });
//   res.json(students);
// };

export const getStudents = async (req, res) => {
  const students = await Student.find({ isActive: true }).sort({ usn: 1 });
  res.json(students);
};



// UPDATE student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DISABLE student (soft delete)
export const disableStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student disabled successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
