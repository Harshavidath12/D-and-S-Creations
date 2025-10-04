const Complaint = require('../Model/Complaint');
const Designer = require('../Model/Designer');
const PDFDocument = require('pdfkit');


exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('designerId', 'name type');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('designerId', 'name type');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createComplaint = async (req, res) => {
  const complaint = new Complaint({
    designerId: req.body.designerId,
    clientName: req.body.clientName,
    description: req.body.description
  });

  try {
    const newComplaint = await complaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.downloadComplaintsPDF = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('designerId', 'name type');

    const doc = new PDFDocument();
    const fileName = 'complaints.pdf';
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);
    doc.fontSize(20).text('Complaints List', { align: 'center' });
    doc.moveDown();

    complaints.forEach((c, i) => {
      doc.fontSize(12)
         .text(`${i + 1}. Client: ${c.clientName}`)
         .text(`   Designer: ${c.designerId.name} (${c.designerId.type})`)
         .text(`   Description: ${c.description}`)
         .text(`   Date: ${c.date.toDateString()}`)
         .moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
