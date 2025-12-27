import Faculty from '../models/Faculty.js';

// CREATE
export const createFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ (active only)
export const getFaculty = async (req, res) => {
  const faculty = await Faculty.find({ isActive: true }).sort({ name: 1 });
  res.json(faculty);
};

// UPDATE
export const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json(faculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DISABLE (soft delete)
export const disableFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json({ message: 'Faculty disabled successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
