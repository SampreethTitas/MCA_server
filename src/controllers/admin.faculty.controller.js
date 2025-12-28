import Faculty from '../models/Faculty.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';


// CREATE
export const createFaculty = async (req, res) => {
  try {
    const { facultyCode, name, email } = req.body;

    // 1️⃣ Prepare credentials
    const username = email;           // or facultyCode if you prefer
    const tempPassword = facultyCode; // simple for testing
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // 2️⃣ Create User account
    const user = await User.create({
      username,
      passwordHash,
      role: 'FACULTY'
    });

    // 3️⃣ Create Faculty profile linked to user
    const faculty = await Faculty.create({
      facultyCode,
      name,
      email,
      user: user._id
    });

    res.status(201).json({
      message: 'Faculty created with login credentials',
      faculty,
      credentials: {
        username,
        password: tempPassword
      }
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Faculty code or username already exists'
      });
    }
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
