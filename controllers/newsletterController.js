const Subscriber = require("../models/Subscriber");
const crypto = require("crypto");
const transporter = require("../config/nodemailer");

// SUSCRIBIR: Crea o reenvía el token de verificación si no está verificado
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "El email es obligatorio." });
    }

    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.verified) {
        return res.status(400).json({ error: "Este email ya está suscripto." });
      } else {
        // Si ya existe pero no se verificó, regeneramos token y reenviamos
        subscriber.verificationToken = crypto.randomBytes(32).toString("hex");
        subscriber.verificationTokenExpires = Date.now() + 3600000; // Token válido por 1 hora
        await subscriber.save();

        const verificationLink = `https://undershit.com/verify?token=${subscriber.verificationToken}`;

        await transporter.sendMail({
          from: `"UNDERSHIT RECORDS" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Verifica tu suscripción",
          html: `
           <div style="
  font-family: Arial, sans-serif; 
  color: #333333; 
  max-width: 600px; 
  margin: 0 auto; 
  padding: 20px; 
  background-color: #f8f8f8;
  border-radius: 5px;
">
  <h2 style="text-align: center; color: #4CAF50; margin-top: 0;">
    ¡Confirmá tu suscripción!
  </h2>
  <p style="line-height: 1.6;">
    Gracias por suscribirte a UNDERSHIT RECORDS. Para confirmar tu dirección de correo electrónico, hacé clic en el siguiente botón:
  </p>

  <div style="text-align: center; margin: 20px 0;">
    <a 
      href="${verificationLink}" 
      style="
        background-color: #4CAF50;
        color: #ffffff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
      "
    >
      Confirmar Email
    </a>
  </div>

  <p style="line-height: 1.6;">
    O copiá y pegá este enlace en tu navegador:
    <br>
    <a href="${verificationLink}" style="color: #4CAF50; word-wrap: break-word;">
      ${verificationLink}
    </a>
  </p>

  <hr style="border: none; border-top: 1px solid #cccccc; margin: 30px 0;">

  <p style="font-size: 14px; color: #666;">
    Si no solicitaste esta suscripción, simplemente ignorá este correo o respondé con un mensaje indicando el error.
  </p>

  <p style="font-size: 14px; color: #666; margin-top: 40px;">
    Atentamente,<br>
    <strong>El Equipo de UNDERSHIT RECORDS</strong>
  </p>
</div>
          `,
        });

        return res
          .status(200)
          .json({ message: "Reenviado el email de verificación." });
      }
    }

    // Nuevo suscriptor: Generamos token, lo guardamos y enviamos el mail
    const verificationToken = crypto.randomBytes(32).toString('hex');
    subscriber = new Subscriber({
      email,
      verificationToken,
    });
    await subscriber.save();

    const verificationLink = `https://undershit.com/verify?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"UNDERSHIT RECORDS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verifica tu suscripción",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5;">
          <h2>¡Confirmá tu suscripción!</h2>
          <p>Para confirmar tu email, hacé clic en el siguiente enlace:</p>
          <a href="${verificationLink}" style="background-color:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Confirmar Email</a>
          <p>O copiá y pegá este link en tu navegador:</p>
          <p>${verificationLink}</p>
          <br>
          <small>Si no solicitaste esta suscripción, podés ignorar este mensaje.</small>
        </div>
      `,
    });

    res
      .status(201)
      .json({
        message: "Suscripción iniciada. Por favor, verifica tu correo.",
      });
  } catch (error) {
    console.error("❌ Error al suscribir:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// VERIFICAR: Valida el token y marca la suscripción como verificada
exports.verify = async (req, res) => {
  try {
    const { token } = req.query; // Se recibe el token en la query string
    if (!token) {
      return res.status(400).json({ error: 'Token de verificación requerido.' });
    }

    const subscriber = await Subscriber.findOne({
      verificationToken: token
    });

    if (!subscriber) {
      return res.status(400).json({ error: 'Token inválido o expirado.' });
    }

    subscriber.verified = true;
    subscriber.verificationToken = undefined;
    subscriber.verificationTokenExpires = undefined;
    await subscriber.save();

    res.status(200).json({ message: '¡Tu correo fue verificado con éxito!' });
  } catch (error) {
    console.error('❌ Error al verificar:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// DESUSCRIBIR: Marca al suscriptor como desuscripto
exports.unsubscribe = async (req, res) => {
  try {
    const { email, reason } = req.body;

    if (!email) {
      return res.status(400).json({ error: "El email es obligatorio." });
    }

    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ error: "Email no encontrado." });
    }

    subscriber.unsubscribedAt = new Date();
    subscriber.unsubscribedReason = reason || "Sin especificar";
    await subscriber.save();

    res.status(200).json({ message: "Te desuscribiste correctamente." });
  } catch (error) {
    console.error("❌ Error al desuscribir:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// LISTAR SUSCRIPTORES
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("❌ Error al obtener suscriptores:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// ELIMINAR SUSCRIPTOR
exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    await Subscriber.findByIdAndDelete(id);
    console.log(`✅ Suscriptor eliminado: ${id}`);
    res.status(200).json({ message: "Suscriptor eliminado." });
  } catch (error) {
    console.error("❌ Error al eliminar suscriptor:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// ENVIAR NEWSLETTER: Envia a todos los verificados y activos
exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ error: "Asunto y contenido requeridos." });
    }

    const subscribers = await Subscriber.find({
      verified: true,
      unsubscribedAt: { $exists: false },
    });

    const sendEmails = subscribers.map((subscriber) =>
      transporter.sendMail({
        from: `"UNDERSHIT RECORDS" <${process.env.EMAIL_USER}>`,
        to: subscriber.email,
        subject,
        text: content,
      })
    );

    await Promise.all(sendEmails);
    console.log(`✅ Newsletter enviado a ${subscribers.length} suscriptores`);
    res
      .status(200)
      .json({
        message: `Newsletter enviado a ${subscribers.length} suscriptores`,
      });
  } catch (error) {
    console.error("❌ Error al enviar newsletter:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
