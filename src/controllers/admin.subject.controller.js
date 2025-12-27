import Subject from '../models/Subject.js';

// CREATE
export const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        message: `${field} already exists. Please use a unique value.`
      });
    }
    res.status(400).json({ message: err.message });
  }
};

// READ (active only)
export const getSubjects = async (req, res) => {
  const subjects = await Subject.find({ isActive: true }).sort({ semester: 1 });
  res.json(subjects);
};

// UPDATE
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DISABLE
export const disableSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject disabled successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
