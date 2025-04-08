// config/nodemailer.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Configuración del transportador
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Usamos SSL (recomendado en producción)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Permite certificados autofirmados en dev
  },
});

// Pequeña validación para saber si el transporter está listo
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Error al configurar el transporter de nodemailer:', error);
  } else {
    console.log('✅ Transporter de nodemailer listo para enviar emails');
  }
});

module.exports = transporter;
