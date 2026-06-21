import Design from '../models/Design.js';

export const getDesigns = async (req, res) => {
  try {
    const filter = {};
    
    
    if (req.query.type) {
      filter.type = req.query.type; // service ya gallery
    }
    
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    const designs = await Design.find(filter).sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createDesign = async (req, res) => {
  try {
    const design = await Design.create({
      ...req.body,
      uploadedBy: req.user._id
    });
    res.status(201).json(design);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};