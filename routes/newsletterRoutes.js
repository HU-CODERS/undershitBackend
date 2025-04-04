const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

router.post('/subscribe', newsletterController.subscribe); // Suscribir con verificación por email
router.get('/verify', newsletterController.verifyEmail); // Verificar email
router.get('/subscribers', newsletterController.getSubscribers);
router.delete('/:id', newsletterController.deleteSubscriber);
router.post('/send', newsletterController.sendNewsletter);

module.exports = router;
