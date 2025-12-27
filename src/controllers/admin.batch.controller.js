import Batch from '../models/Batch.js';

// CREATE
export const createBatch = async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Batch with same name already exists for this section and year'
      });
    }
    res.status(400).json({ message: err.message });
  }
};

// READ (active only)
export const getBatches = async (req, res) => {
  const filter = { isActive: true };

  if (req.query.academicYear) {
    filter.academicYear = Number(req.query.academicYear);
  }
  if (req.query.section) {
    filter.section = req.query.section;
  }

  const batches = await Batch.find(filter).sort({ name: 1 });
  res.json(batches);
};

// UPDATE
export const updateBatch = async (req, res) => {
  try {
    const updated = await Batch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DISABLE
export const disableBatch = async (req, res) => {
  try {
    const disabled = await Batch.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!disabled) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json({ message: 'Batch disabled successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
