const express = require('express');
const router = express.Router();
const imageController = require('../controllers/galleryController');

router.get('/', imageController.getImages);
router.post('/upload', imageController.uploadImages);
router.delete('/:id', imageController.deleteImage);

module.exports = router;
