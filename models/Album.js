const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    year: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true }, // Antes era "image", ahora "cover"
    catalog: { type: String, required: true },
    links: {
      soundcloud: { type: String, default: "" },
      bandcamp: { type: String, default: "" },
    },
  });

module.exports = mongoose.model('Album', albumSchema);
