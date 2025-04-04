const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');

// Enviar mensaje a los suscriptores
// Configuración del transporter de Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // ⚠️ Para producción usa 465 y secure: true
  secure: true, // false para 587 (TLS), true para 465 (SSL)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Para evitar errores SSL en localhost
  },
});

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    const exists = await Subscriber.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Este email ya está suscrito' });

    // Generar un token único
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Crear suscriptor con token de verificación
    const newSubscriber = new Subscriber({ email, verificationToken });
    await newSubscriber.save();

    // Enlace de verificación
    const verificationLink = `https://undershit.com/verify?token=${verificationToken}`;

    // Configurar el email
    const mailOptions = {
      from: `"UNDERSHIT RECORDS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verifica tu suscripción a la newsletter de UNDERSHIT',
      html: `<p>Haz clic en el siguiente enlace para verificar tu email:</p>
             <a href="${verificationLink}">${verificationLink}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Verificación enviada, revisa tu email' });
  } catch (error) {
    console.error('❌ Error al suscribir:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token requerido' });

    const subscriber = await Subscriber.findOne({ verificationToken: token });
    if (!subscriber) return res.status(400).json({ error: 'Token inválido o expirado' });

    // Marcar como verificado y eliminar el token
    subscriber.verified = true;
    subscriber.verificationToken = null;
    await subscriber.save();

    res.status(200).json({ message: 'Email verificado con éxito' });
  } catch (error) {
    console.error('❌ Error verificando email:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todos los suscriptores
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    console.log(`✅ Se obtuvieron ${subscribers.length} suscriptores`);
    res.status(200).json(subscribers);
  } catch (error) {
    console.error('❌ Error obteniendo suscriptores:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar un suscriptor
exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Subscriber.findByIdAndDelete(id);

    if (!deleted) {
      console.error(`❌ Error: No se encontró el suscriptor con ID ${id}`);
      return res.status(404).json({ error: 'Suscriptor no encontrado' });
    }

    console.log(`✅ Suscriptor eliminado: ${deleted.email}`);
    res.status(200).json({ message: 'Suscriptor eliminado' });
  } catch (error) {
    console.error('❌ Error eliminando suscriptor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};



exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, message, attachments } = req.body;
    
    // Validar que el asunto y el mensaje estén presentes
    if (!subject || !message) {
      console.error('❌ Error: Asunto y mensaje son requeridos');
      return res.status(400).json({ error: 'Asunto y mensaje son requeridos' });
    }

    // Obtener todos los suscriptores
    const subscribers = await Subscriber.find();
    const recipientEmails = subscribers.map(sub => sub.email);

    // Verificar si hay suscriptores
    if (recipientEmails.length === 0) {
      console.error('❌ Error: No hay suscriptores');
      return res.status(400).json({ error: 'No hay suscriptores' });
    }

    // Opcional: Transformar adjuntos si los hay
    const formattedAttachments = attachments?.map(att => ({
      filename: att.filename,
      path: att.path,
    })) || [];

    // Configurar el email
    const mailOptions = {
      from: `"UNDERSHIT RECORDS" <${process.env.EMAIL_USER}>`,
      to: recipientEmails.join(', '), // Enviar a todos los suscriptores
      subject,
      text: message,
      attachments: formattedAttachments,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Newsletter enviada a ${recipientEmails.length} suscriptores`);
    res.status(200).json({ message: 'Newsletter enviada con éxito' });
  } catch (error) {
    console.error('❌ Error enviando la newsletter:', error);
    res.status(500).json({ error: 'Error enviando el correo' });
  }
};
