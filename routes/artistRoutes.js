const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const upload = require('../middlewares/upload'); // Importamos Multer

router.get('/', artistController.getArtists);
router.post('/add', upload.single('image'), artistController.addArtist); // Maneja la imagen
router.put('/edit/:id', upload.single('image'), artistController.editArtist); // Maneja la imagen
router.delete('/:id', artistController.deleteArtist);

module.exports = router;
