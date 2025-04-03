const Artist = require('../models/Artist');

// Obtener todos los artistas
exports.getArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    console.log(`✅ Se obtuvieron ${artists.length} artistas`);
    res.status(200).json(artists);
  } catch (error) {
    console.error('❌ Error obteniendo artistas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Agregar un artista con imagen
exports.addArtist = async (req, res) => {
  try {
    const { name, nickname, bio, instagram, soundcloud, spotify, releases, collaborations, genres } = req.body;
    const image = req.file ? `/artistUpload/${req.file.filename}` : null;

    if (!name || !bio || !image) {
      console.error('❌ Error: Faltan datos obligatorios');
      return res.status(400).json({ error: 'Nombre, biografía e imagen son obligatorios' });
    }

    const newArtist = new Artist({
      name,
      nickname,
      image,
      bio,
      instagram,
      soundcloud,
      spotify,
      releases: JSON.parse(releases || '[]'),
      collaborations: JSON.parse(collaborations || '[]'),
      genres: JSON.parse(genres || '[]'),
    });

    await newArtist.save();
    console.log(`✅ Artista agregado: ${newArtist.name}`);
    res.status(201).json({ message: 'Artista agregado', artist: newArtist });
  } catch (error) {
    console.error('❌ Error al agregar artista:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Editar un artista (con opción de cambiar imagen)
exports.editArtist = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, nickname, bio, instagram, soundcloud, spotify, releases, collaborations, genres, image } = req.body;

    // Si `releases`, `collaborations` o `genres` llegan como strings, parsearlos a arrays
    if (typeof releases === "string") {
      try {
        releases = JSON.parse(releases);
      } catch (error) {
        console.error("❌ Error al parsear releases:", error);
        return res.status(400).json({ error: "Formato inválido en releases" });
      }
    }

    if (typeof collaborations === "string") {
      try {
        collaborations = JSON.parse(collaborations);
      } catch (error) {
        console.error("❌ Error al parsear collaborations:", error);
        return res.status(400).json({ error: "Formato inválido en collaborations" });
      }
    }

    if (typeof genres === "string") {
      try {
        genres = JSON.parse(genres);
      } catch (error) {
        console.error("❌ Error al parsear genres:", error);
        return res.status(400).json({ error: "Formato inválido en genres" });
      }
    }

    // Si hay un archivo, actualiza la imagen; si no, conserva la anterior
    const imagePath = req.file ? `/artistUpload/${req.file.filename}` : image;

    const updatedArtist = await Artist.findByIdAndUpdate(
      id,
      { name, nickname, image: imagePath, bio, instagram, soundcloud, spotify, releases, collaborations, genres },
      { new: true }
    );

    if (!updatedArtist) {
      console.error(`❌ Error: No se encontró el artista con ID ${id}`);
      return res.status(404).json({ error: "Artista no encontrado" });
    }

    console.log(`✅ Artista actualizado: ${updatedArtist.name}`);
    res.status(200).json({ message: "Artista actualizado", artist: updatedArtist });
  } catch (error) {
    console.error("❌ Error al actualizar artista:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Eliminar un artista
exports.deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Artist.findByIdAndDelete(id);

    if (!deleted) {
      console.error(`❌ Error: No se encontró el artista con ID ${id}`);
      return res.status(404).json({ error: 'Artista no encontrado' });
    }

    console.log(`✅ Artista eliminado: ${deleted.name}`);
    res.status(200).json({ message: 'Artista eliminado' });
  } catch (error) {
    console.error('❌ Error eliminando artista:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
