const express = require('express');
const router = express.Router();
const complaintController = require('../Controllers/complaintController');

router.get('/', complaintController.getAllComplaints);
router.get('/:id', complaintController.getComplaintById);
router.post('/', complaintController.createComplaint);
router.put('/:id', complaintController.updateComplaint);
router.delete('/:id', complaintController.deleteComplaint);
router.get('/download/pdf', complaintController.downloadComplaintsPDF);

module.exports = router;
