const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // Nombre del archivo
  path: { type: String, required: true }, // Ruta donde se guarda
  description: { type: String }, // Descripción opcional
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', ImageSchema);
