const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
  


const app = express();
app.use(express.json({ limit: '15mb' }));
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

const newsletterRoutes = require('./routes/newsletterRoutes');
app.use('/api/newsletter', newsletterRoutes);

const imageRoutes = require('./routes/galleryRoutes');
app.use('/api/images', imageRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/artistUpload', express.static(path.join(__dirname, 'artistUpload')));
const pingRoutes = require('./routes/pingRoutes');
app.use("/api", pingRoutes);

const artistRoutes = require('./routes/artistRoutes');
app.use('/api/artists', artistRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
