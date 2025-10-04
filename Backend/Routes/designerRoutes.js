const express = require('express');
const router = express.Router();
const designerController = require('../Controllers/designerController');

router.get('/', designerController.getAllDesigners);
router.get('/:id', designerController.getDesignerById);
router.post('/', designerController.createDesigner);
router.put('/:id', designerController.updateDesigner);
router.delete('/:id', designerController.deleteDesigner);

module.exports = router;
