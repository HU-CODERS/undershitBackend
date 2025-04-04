const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }, // Nuevo campo
  verificationToken: { type: String }, // Token de verificación
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
