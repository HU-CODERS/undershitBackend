const Album = require('../models/Album');

exports.getAlbums = async (req, res) => {
    try {
      const albums = await Album.find();
      const formattedAlbums = albums.map(album => ({
        _id: album._id,
        title: album.title,
        artist: album.artist,
        year: album.year,
        type: album.type,
        image: album.image,
        catalog: album.catalog,
        links: {
          soundcloud: album.links?.soundcloud || '',
          bandcamp: album.links?.bandcamp || '',
        },
      }));
  
      console.log(`✅ Se obtuvieron ${formattedAlbums.length} releases`);
      res.status(200).json(formattedAlbums);
    } catch (error) {
      console.error('❌ Error obteniendo releases:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  };
  
  // Agregar un release
  exports.addAlbum = async (req, res) => {
    try {
      const { title, artist, year, type, catalog, soundcloud, bandcamp } = req.body;
      const image = req.file ? `/albumUpload/${req.file.filename}` : null;
  
      if (!title || !artist || !year || !type || !catalog || !image) {
        console.error('❌ Error: Faltan datos obligatorios');
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }
  
      const newAlbum = new Album({
        title,
        artist,
        year,
        type,
        image,
        catalog,
        links: {
          soundcloud,
          bandcamp,
        },
      });
  
      await newAlbum.save();
      console.log(`✅ Release agregado: ${newAlbum.title}`);
      res.status(201).json({ message: 'Release agregado', album: newAlbum });
    } catch (error) {
      console.error('❌ Error al agregar release:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  };
  
  // Editar un release
  exports.editAlbum = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, artist, year, type, catalog, soundcloud, bandcamp, image } = req.body;
  
      const imagePath = req.file ? `/albumUpload/${req.file.filename}` : image;
  
      const updatedAlbum = await Album.findByIdAndUpdate(
        id,
        {
          title,
          artist,
          year,
          type,
          image: imagePath,
          catalog,
          links: {
            soundcloud,
            bandcamp,
          },
        },
        { new: true }
      );
  
      if (!updatedAlbum) {
        console.error(`❌ Error: No se encontró el release con ID ${id}`);
        return res.status(404).json({ error: "Release no encontrado" });
      }
  
      console.log(`✅ Release actualizado: ${updatedAlbum.title}`);
      res.status(200).json({ message: "Release actualizado", album: updatedAlbum });
    } catch (error) {
      console.error("❌ Error al actualizar release:", error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  };
  
  // Eliminar un release
  exports.deleteAlbum = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Album.findByIdAndDelete(id);
  
      if (!deleted) {
        console.error(`❌ Error: No se encontró el release con ID ${id}`);
        return res.status(404).json({ error: 'Release no encontrado' });
      }
  
      console.log(`✅ Release eliminado: ${deleted.title}`);
      res.status(200).json({ message: 'Release eliminado' });
    } catch (error) {
      console.error('❌ Error eliminando release:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  };