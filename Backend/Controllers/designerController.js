const Designer = require('../Models/Designer');

// to get all designers
exports.getAllDesigners = async (req, res) => {
  try {
    const designers = await Designer.find().sort({ name: 1 }); // Sorted A-Z
    res.json(designers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//to get all designers by id
exports.getDesignerById = async (req, res) => {
  try {
    const designer = await Designer.findById(req.params.id);
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.json(designer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//to create a new designer
exports.createDesigner = async (req, res) => {
  const designer = new Designer({
    name: req.body.name,
    type: req.body.type,
    previousDesigns: req.body.previousDesigns || [],
    email: req.body.email 
  });

  try {
    const newDesigner = await designer.save();
    res.status(201).json(newDesigner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//To update an existing Designer
exports.updateDesigner = async (req, res) => {
  try {
    const designer = await Designer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.json(designer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//To delete any designer
exports.deleteDesigner = async (req, res) => {
  try {
    const designer = await Designer.findByIdAndDelete(req.params.id);
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.json({ message: 'Designer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
