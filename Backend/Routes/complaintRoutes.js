const express = require('express');
const router = express.Router();
const complaintController = require('../Controllers/complaintController');

//path of the backend(API) and connect Url to controllers,
router.get('/', complaintController.getAllComplaints);      //get all complaints
router.get('/:id', complaintController.getComplaintById);   //get complaints by id
router.post('/', complaintController.createComplaint);      //create complaints
router.put('/:id', complaintController.updateComplaint);    //update complaints
router.delete('/:id', complaintController.deleteComplaint); //delete complaints
router.get('/download/pdf', complaintController.downloadComplaintsPDF); //generate pdf 

module.exports = router;
