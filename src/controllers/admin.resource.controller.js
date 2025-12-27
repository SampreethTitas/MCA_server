import Resource from '../models/Resource.js';

// CREATE
export const createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
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
export const getResources = async (req, res) => {
  const resources = await Resource.find({ isActive: true }).sort({ roomCode: 1 });
  res.json(resources);
};

// UPDATE
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DISABLE
export const disableResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource disabled successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
