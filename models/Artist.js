const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: { type: String },
  image: { type: String, required: true }, // Aquí se guardará la URL de la imagen
  bio: { type: String, required: true },
  instagram: { type: String, required: true },
  soundcloud: { type: String, required: true },
  spotify: { type: String, required: true },
  releases: [
    {
      name: { type: String, required: true },
      link: { type: String },
    },
  ],
  collaborations: [{ type: String }],
  genres: [{ type: String, required: true }],
});

module.exports = mongoose.model('Artist', artistSchema);
