const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const upload = require('../middlewares/uploadAlbum'); // Importamos Multer

router.get('/', albumController.getAlbums);
router.post('/add', upload.single('image'), albumController.addAlbum); // Maneja la imagen
router.put('/edit/:id', upload.single('image'), albumController.editAlbum); // Maneja la imagen
router.delete('/:id', albumController.deleteAlbum);

module.exports = router;
