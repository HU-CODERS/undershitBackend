const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Email inválido'],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  unsubscribedAt: {
    type: Date,
    default: null,
  },
  unsubscribedReason: {
    type: String,
    maxlength: 500, // Nadie necesita más de 500 caracteres para decir "me aburrí de tu spam"
    default: '',
  },
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
