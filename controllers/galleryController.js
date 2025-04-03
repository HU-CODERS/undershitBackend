const Image = require('../models/Image');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🔹 Configuración de multer para guardar archivos en la carpeta `/uploads`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).array('file', 10); // Ahora acepta el campo 'file'

// 🔹 Obtener todas las imágenes (GET)
exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    console.error('❌ Error obteniendo imágenes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// 🔹 Subir imágenes (POST)
exports.uploadImages = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('❌ Error al subir la imagen:', err);
      return res.status(500).json({ error: 'Error subiendo la imagen' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se enviaron imágenes' });
    }

    try {
      const images = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
        description: req.body.description || '',
      }));

      const savedImages = await Image.insertMany(images);
      console.log(`✅ ${savedImages.length} imagen(es) guardada(s) correctamente`);
      res.status(201).json({ message: 'Imágenes subidas exitosamente', images: savedImages });
    } catch (error) {
      console.error('❌ Error guardando imágenes en la BD:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
};

// 🔹 Eliminar imagen por ID (DELETE)
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      console.error(`❌ Imagen con ID ${id} no encontrada`);
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    const filePath = path.join(__dirname, '../', image.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Borra el archivo del servidor

    await Image.findByIdAndDelete(id);
    console.log(`✅ Imagen eliminada con éxito: ${id}`);
    res.status(200).json({ message: 'Imagen eliminada con éxito' });
  } catch (error) {
    console.error('❌ Error eliminando imagen:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
